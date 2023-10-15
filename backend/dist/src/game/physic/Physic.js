"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Physic = void 0;
const events_1 = require("events");
const ball_1 = require("./ball");
const player_1 = require("./player");
const world_1 = require("./world");
const machine_1 = require("../types/machine");
const stone_1 = require("./stone");
const constante_1 = require("./constante");
class Physic extends events_1.EventEmitter {
    constructor(playerNeg, playerPos) {
        super();
        this.players = [];
        this.ball = (0, ball_1.createBall)();
        this.players.push((0, player_1.createPlayer)(playerNeg, -1));
        this.players.push((0, player_1.createPlayer)(playerPos, 1));
        this.world = (0, world_1.createWorld)({
            ball: this.ball,
            playerNeg: this.players[0],
            playerPos: this.players[1],
        });
        this.emit = this.emit.bind(this);
        this.getSkillInfo = this.getSkillInfo.bind(this);
    }
    ;
    getSkillInfo(index) {
        const player = this.players[index];
        if (player.map === machine_1.MapTheme.MEDIEVAL) {
            return (player.location === -1)
                ? {
                    power: {
                        left: !!(player.powerMedieval.body && Math.sign(player.powerMedieval.body.position[1]) === 1),
                        right: !!(player.powerMedieval.body && Math.sign(player.powerMedieval.body.position[1]) === -1)
                    },
                    ulti: {
                        stone: [
                            !!player.ultiMedieval.stones[3].body,
                            !!player.ultiMedieval.stones[2].body,
                            !!player.ultiMedieval.stones[1].body,
                            !!player.ultiMedieval.stones[0].body
                        ]
                    }
                } : {
                power: {
                    left: !!(player.powerMedieval.body && Math.sign(player.powerMedieval.body.position[1]) === -1),
                    right: !!(player.powerMedieval.body && Math.sign(player.powerMedieval.body.position[1]) === 1)
                },
                ulti: {
                    stone: [
                        !!player.ultiMedieval.stones[0].body,
                        !!player.ultiMedieval.stones[1].body,
                        !!player.ultiMedieval.stones[2].body,
                        !!player.ultiMedieval.stones[3].body
                    ]
                }
            };
        }
        else if (player.map === machine_1.MapTheme.NINJA) {
            return {
                power: {
                    factor: (player.powerNinja.speedFactor - 1) * 2
                },
                ulti: {}
            };
        }
        else if (player.map === machine_1.MapTheme.WESTERN) {
            return {
                power: {
                    isActive: player.powerWestern.isActive
                },
                ulti: {}
            };
        }
        else if (player.map === machine_1.MapTheme.RETRO) {
            return {
                power: {
                    isActive: player.power
                },
                ulti: {}
            };
        }
        else {
            return {};
        }
    }
    ;
    pause() {
        this.world.pause();
    }
    ;
    play() {
        this.world.play();
    }
    ;
    setKeys(index, key) {
        this.players[index].key = key;
    }
    ;
    setPower(index, power) {
        const player = this.players[index];
        if (player.map === machine_1.MapTheme.MEDIEVAL) {
            if (power && !player.power
                && !player.powerMedieval.body
                && Math.sign(player.body.position[1])) {
                const locationX = player.location;
                const locationY = Math.sign(player.body.position[1]);
                const left = 1 * locationX - 0.3;
                const right = 1 * locationX + 0.3;
                const top = (constante_1.MAP_HEIGHT / 4 * locationY) - 0.3;
                const bottom = (constante_1.MAP_HEIGHT / 4 * locationY) + 0.3;
                if (this.ball.body.position[0] + constante_1.BALL_RADIUS <= left || this.ball.body.position[0] - constante_1.BALL_RADIUS >= right ||
                    this.ball.body.position[1] + constante_1.BALL_RADIUS <= top || this.ball.body.position[1] - constante_1.BALL_RADIUS >= bottom) {
                    player.power = true;
                    player.powerMedieval = {
                        body: (0, stone_1.default)(0.5, 0.5, 1, constante_1.MAP_HEIGHT / 4, locationX, locationY),
                        isDestroy: false
                    };
                    this.world.addBody(player.powerMedieval.body);
                }
            }
        }
        if (player.map === machine_1.MapTheme.WESTERN) {
            if (power && !player.power && Math.abs(player.body.velocity[1]) > 1) {
                player.power = true;
                player.powerWestern.isActive = true;
                setTimeout(() => {
                    player.power = false;
                }, 2000);
            }
        }
        if (player.map === machine_1.MapTheme.NINJA) {
            player.power = power;
            if (player.power && player.powerNinja.speedFactor < 1.5) {
                player.powerNinja.speedFactor += 0.01;
            }
            else if (player.powerNinja.speedFactor > 1) {
                player.powerNinja.speedFactor -= 0.02;
            }
        }
        if (player.map === machine_1.MapTheme.RETRO) {
            if (power && !player.power) {
                player.power = true;
                setTimeout(() => {
                    player.power = false;
                }, 5000);
            }
        }
    }
    ;
    setUlti(index, ulti) {
        const player = this.players[index];
        if (player.map === machine_1.MapTheme.MEDIEVAL) {
            if (!player.ulti && ulti) {
                const x = constante_1.PADDLE_POSITION + 0.5;
                const locationX = player.location;
                player.ulti = ulti;
                for (let i = 0; i < 4; i++) {
                    const y = constante_1.MAP_HEIGHT * 0.25 * i - constante_1.MAP_HEIGHT * 0.375;
                    player.ultiMedieval.stones[i] = {
                        body: ((0, stone_1.default)(0.2, 1, x, y, locationX, 1)),
                        isDestroy: false
                    };
                    this.world.addBody(player.ultiMedieval.stones[i].body);
                }
            }
        }
    }
    ;
    start() {
        this.players.forEach(p => p.reset());
        return this.ball.start(this.emit);
    }
    ;
    stop() {
        this.world.stop();
    }
    ;
    get ballPosition() {
        if (this.ball.score) {
            this.players.forEach(p => {
                p.powerMedieval.body && (p.powerMedieval.isDestroy = true);
                p.ultiMedieval.stones.forEach(stone => stone.body && (stone.isDestroy = true));
                p.powerNinja.speedFactor = 1;
                p.ulti = false;
            });
            this.ball.reset();
            this.emit('score', (Math.sign(this.ball.score) === -1) ? 1 : 0);
        }
        return { x: this.ball.body.position[0], y: this.ball.body.position[1], z: 0 };
    }
    ;
    get ballVelocity() {
        return { x: this.ball.body.velocity[0], y: this.ball.body.velocity[1], z: 0 };
    }
    ;
    get collisions() {
        return this.world.collisions;
    }
    ;
    get playersPosition() {
        return [
            { x: this.players[0].body.position[0], y: this.players[0].body.position[1], z: 0 },
            { x: this.players[1].body.position[0], y: this.players[1].body.position[1], z: 0 }
        ];
    }
    ;
    get playersVelocity() {
        return [
            { x: this.players[0].body.velocity[0], y: this.players[0].body.velocity[1], z: 0 },
            { x: this.players[1].body.velocity[0], y: this.players[1].body.velocity[1], z: 0 }
        ];
    }
    ;
    get skillInfo() {
        return [
            this.getSkillInfo(0),
            this.getSkillInfo(1)
        ];
    }
    get powerIsActive() {
        return [
            this.players[0].power,
            this.players[1].power
        ];
    }
}
exports.Physic = Physic;
;
//# sourceMappingURL=Physic.js.map