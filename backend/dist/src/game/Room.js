"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const xstate_1 = require("xstate");
const machine_1 = require("./states/machine");
const machine_2 = require("./types/machine");
const Physic_1 = require("./physic/Physic");
class Room {
    constructor(state = machine_2.GameStates.MAP, context = {}) {
        this.machine = null;
        this.clients = [];
        this.machine = (0, xstate_1.interpret)(machine_1.GameMachine.withContext({
            ...machine_1.GameModel.initialContext,
            ...context
        }).withConfig({
            ...machine_1.GameMachine.config,
            initial: state,
            actions: {
                sendEnd: this.sendEnd.bind(this)
            }
        }))
            .start();
        this.machine.onTransition(currentState => { this.state = currentState; });
        this.counter = this.counter.bind(this);
        this.score = this.score.bind(this);
    }
    ;
    ball(client) {
        client.emit('ball', { position: this.physic.ballPosition, velocity: this.physic.ballVelocity });
    }
    ;
    chooseMap(client, map) {
        this.machine.send(machine_1.GameModel.events.chooseMap(client.handshake.query.token, map));
    }
    ;
    counter(counter) {
        console.log(counter);
        this.clients.map(c => c.emit('counter', { counter }));
    }
    ;
    join(client, name = 'login') {
        if (this.machine.send(machine_1.GameModel.events.join(client.handshake.query.token, name)).changed) {
            this.clients.push(client);
            if (this.clients.length === 2)
                this.reconnection = setTimeout(() => {
                    client.emit('reconnect');
                    console.log('reconnect required');
                }, 30000);
            return true;
        }
        return false;
    }
    ;
    leave(client) {
        if (this.machine.send(machine_1.GameModel.events.leave(client.handshake.query.token)).changed) {
            const index = this.clients.indexOf(client);
            this.clients.splice(index, 1);
            if (index === 1)
                clearTimeout(this.reconnection);
            return true;
        }
        return false;
    }
    ;
    move(client, key) {
        this.machine.send(machine_1.GameModel.events.update());
        if (key.ulti && this.machine.send(machine_1.GameModel.events.ulti(client.handshake.query.token)).changed) {
            this.physic.pause();
            this.physic.setUlti(this.clients.indexOf(client), key.ulti);
            this.clients.find(c => c !== client).emit('ulti');
        }
        const player = this.state.context.players[this.clients.indexOf(client)];
        if (!player.power.time) {
            if (player.map === machine_2.MapTheme.NINJA) {
                if (!key.power && this.physic.powerIsActive[this.clients.indexOf(client)])
                    this.machine.send(machine_1.GameModel.events.power(client.handshake.query.token));
                this.physic.setPower(this.clients.indexOf(client), key.power);
            }
            else {
                this.physic.setPower(this.clients.indexOf(client), key.power);
                if (this.physic.powerIsActive[this.clients.indexOf(client)])
                    this.machine.send(machine_1.GameModel.events.power(client.handshake.query.token));
            }
        }
        this.physic.setKeys(this.clients.indexOf(client), { leftward: key.leftward, rightward: key.rightward });
        this.player(client);
    }
    ;
    play(client) {
        if (this.machine.send(machine_1.GameModel.events.ready(client.handshake.query.token)).changed) {
            if (this.machine.send(machine_1.GameModel.events.start()).changed) {
                this.physic.play();
                this.clients.map(c => c.emit('play'));
            }
        }
    }
    ;
    player(client) {
        let players = [{
                position: this.physic.playersPosition[0],
                velocity: this.physic.playersVelocity[0],
                skillInfo: this.physic.skillInfo[0],
                collision: this.physic.collisions.paddle[0],
                cooldown: this.state.context.players[0].power.time
            }, {
                position: this.physic.playersPosition[1],
                velocity: this.physic.playersVelocity[1],
                skillInfo: this.physic.skillInfo[1],
                collision: this.physic.collisions.paddle[1],
                cooldown: this.state.context.players[1].power.time
            }];
        if (this.clients.indexOf(client) === 1) {
            players = [players[1], players[0]];
        }
        client.emit('players', { players });
    }
    ;
    skillInfo(client) {
        let players = [{
                skillInfo: this.physic.skillInfo[0]
            }, {
                skillInfo: this.physic.skillInfo[1]
            }];
        if (this.clients.indexOf(client) === 1) {
            players = [players[1], players[0]];
        }
        client.emit('skillInfo', { players });
    }
    ;
    restart() {
        this.machine.send(machine_1.GameModel.events.restart());
        if (this.clients.length === 2)
            this.reconnection = setTimeout(() => {
                this.clients[1].emit('reconnect');
                console.log('reconnect required');
            }, 30000);
        this.physic = null;
    }
    ;
    score(index) {
        this.machine.send(machine_1.GameModel.events.score(index));
        this.physic.setUlti(0, false);
        this.physic.setUlti(1, false);
        this.physic.setPower(0, false);
        this.physic.setPower(1, false);
        this.clients.forEach((c, i) => c.emit('score', { index: (i === index) ? 0 : 1 }));
    }
    ;
    sendEnd() {
        this.clients.map(c => c.emit('end'));
        this.physic?.off('counter', this.counter);
        this.physic?.off('score', this.score);
        this.physic?.stop();
    }
    ;
    sendLeave() {
        this.clients.map(c => c.emit('leave'));
    }
    connect() {
        if (this.machine.send(machine_1.GameModel.events.start()).changed) {
            clearTimeout(this.reconnection);
            this.clients.map(c => c.emit('connection', { players: this.state.context.players }));
        }
    }
    ;
    start(client) {
        if (this.machine.send(machine_1.GameModel.events.ready(client.handshake.query.token)).changed) {
            if (this.machine.send(machine_1.GameModel.events.start()).changed) {
                if (!this.physic) {
                    this.physic = new Physic_1.Physic(this.players[0].map, this.players[1].map);
                    this.physic.on('counter', this.counter);
                    this.physic.on('score', this.score);
                }
                const current = this.physic.start();
                this.clients.map(c => c.emit('start', { current }));
            }
        }
    }
    ;
    stop() {
        this.machine.stop();
    }
    ;
    get isFull() {
        return (this.state.context.players.length === 2) ? true : false;
    }
    get isEmpty() {
        return (this.state.context.players.length === 0) ? true : false;
    }
    get players() {
        return this.clients.map((c, i) => ({
            client: c,
            name: this.state.context.players[i].name,
            map: this.state.context.players[i].map
        }));
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map