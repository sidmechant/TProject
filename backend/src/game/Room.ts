import { InterpreterFrom, StateFrom, interpret } from 'xstate';
import { GameMachine, GameModel } from './states/machine';
import { GameContext, GameStates, MapTheme } from './types/machine';
import { Physic } from './physic/Physic';
import { Player as PlayerMachine } from './types/machine';
import { Player as PlayerPhysic, Power, Vector3 } from './types/physics';
import { Socket } from 'socket.io';

export class Room {
    private machine: InterpreterFrom<typeof GameMachine> = null;
    private physic: Physic;
    private clients: Socket[] = [];
    private state: StateFrom<typeof GameMachine>;
    private reconnection: NodeJS.Timeout;

    constructor(state: GameStates = GameStates.MAP, context: Partial<GameContext> = {}) {
        this.machine = interpret(
            GameMachine.withContext({
                ...GameModel.initialContext,
                ...context
            }).withConfig({
                ...GameMachine.config,
                initial: state,
                actions: {
                    sendEnd: this.sendEnd.bind(this)
                }
            } as any))
            .start();
        this.machine.onTransition(currentState => { this.state = currentState; });
        this.counter = this.counter.bind(this);
        this.score = this.score.bind(this);
    };
    /* ---------- START ----------*/

    /* ---------- EVENTS ----------*/
    public ball(client: Socket): void {
        client.emit('ball', { position: this.physic.ballPosition, velocity: this.physic.ballVelocity });
    };

    public chooseMap(client: Socket, map: PlayerMachine['map']): void {
        this.machine.send(GameModel.events.chooseMap(client.handshake.query.token as string, map));
    };

    public counter(counter: number): void {
        console.log(counter);
        this.clients.map(c => c.emit('counter', { counter }))
    };

    public join(client: Socket, name: PlayerMachine['name'] = 'login'): boolean {
        if (this.machine.send(GameModel.events.join(client.handshake.query.token as string, name)).changed) {
            this.clients.push(client);
            if (this.clients.length === 2)
                this.reconnection = setTimeout(() => {
                    client.emit('reconnect');
                    console.log('reconnect required');
                }, 30000);
            return true;
        }
        return false;
    };

    public leave(client: Socket): boolean {
        if (this.machine.send(GameModel.events.leave(client.handshake.query.token as string)).changed) {
            const index: number = this.clients.indexOf(client);
            this.clients.splice(index, 1);
            if (index === 1) clearTimeout(this.reconnection);
            return true;
        }
        return false;
    };

    public move(client: Socket, key: PlayerPhysic['key'] & { ulti: boolean, power: boolean }) {
        this.machine.send(GameModel.events.update());        

        if (key.ulti && this.machine.send(GameModel.events.ulti(client.handshake.query.token as string)).changed) {
            this.physic.pause();
            this.physic.setUlti(this.clients.indexOf(client), key.ulti)
            // setTimeout(() => {
                this.clients.find(c => c !== client).emit('ulti');
            // }, 100);
        }

        const player = this.state.context.players[this.clients.indexOf(client)];
        if (!player.power.time) {
            if (player.map === MapTheme.NINJA) {
                if (!key.power && this.physic.powerIsActive[this.clients.indexOf(client)])
                    this.machine.send(GameModel.events.power(client.handshake.query.token as string));
                this.physic.setPower(this.clients.indexOf(client), key.power);
            } else {
                this.physic.setPower(this.clients.indexOf(client), key.power);
                if (this.physic.powerIsActive[this.clients.indexOf(client)])
                    this.machine.send(GameModel.events.power(client.handshake.query.token as string));
            }
        }

        this.physic.setKeys(this.clients.indexOf(client), { leftward: key.leftward, rightward: key.rightward });
        this.player(client);
    };

    public play(client: Socket): void {
        if (this.machine.send(GameModel.events.ready(client.handshake.query.token as string)).changed) {
            if (this.machine.send(GameModel.events.start()).changed) {
                this.physic.play()
                this.clients.map(c => c.emit('play'));
            }
        }
    };

    public player(client: Socket): void {
        let players: { position: Vector3, velocity: Vector3, skillInfo: Power, collision: number, cooldown: number }[] = [{
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
        if (this.clients.indexOf(client) === 1) { players = [players[1], players[0]]; }
        client.emit('players', { players });
    };

    public skillInfo(client: Socket): void {
        let players: { skillInfo: Power }[] = [{
            skillInfo: this.physic.skillInfo[0]
        }, {
            skillInfo: this.physic.skillInfo[1]
        }];
        if (this.clients.indexOf(client) === 1) { players = [players[1], players[0]]; }
        client.emit('skillInfo', { players });
    };

    public restart(): void {
        this.machine.send(GameModel.events.restart());
        if (this.clients.length === 2)
            this.reconnection = setTimeout(() => {
                this.clients[1].emit('reconnect');
                console.log('reconnect required');
            }, 30000);
        this.physic = null;
    };

    public score(index: number): void {
        this.machine.send(GameModel.events.score(index));
        this.physic.setUlti(0, false);
        this.physic.setUlti(1, false);
        this.physic.setPower(0, false);
        this.physic.setPower(1, false);
        this.clients.forEach((c, i) => c.emit('score', { index: (i === index) ? 0 : 1 }));
    };

    public sendEnd(): void {
        this.clients.map(c => c.emit('end'))
        this.physic?.off('counter', this.counter);
        this.physic?.off('score', this.score);
        this.physic?.stop();
    };

    public sendLeave(): void {
        this.clients.map(c => c.emit('leave'));
    }

    public connect(): void {
        if (this.machine.send(GameModel.events.start()).changed) {
            clearTimeout(this.reconnection);
            this.clients.map(c => c.emit('connection', { players: this.state.context.players }));
        }
    };

    public start(client: Socket): void {
        if (this.machine.send(GameModel.events.ready(client.handshake.query.token as string)).changed) {
            if (this.machine.send(GameModel.events.start()).changed) {
                if (!this.physic) {
                    this.physic = new Physic(this.players[0].map, this.players[1].map);
                    this.physic.on('counter', this.counter);
                    this.physic.on('score', this.score);
                }
                const current: number = this.physic.start();
                this.clients.map(c => c.emit('start', { current }));
            }
        }
    };

    public stop(): void {
        this.machine.stop();
    };

    get isFull(): boolean {
        return (this.state.context.players.length === 2) ? true : false;
    }

    get isEmpty(): boolean {
        return (this.state.context.players.length === 0) ? true : false;
    }

    get players(): { client: Socket, name: PlayerMachine['name'], map: PlayerMachine['map'] }[] {
        return this.clients.map((c, i) => ({
            client: c,
            name: this.state.context.players[i].name,
            map: this.state.context.players[i].map
        }));
    }
}