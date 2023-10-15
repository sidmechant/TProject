"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayer = void 0;
const p2_es_1 = require("p2-es");
const constante_1 = require("./constante");
const machine_1 = require("../types/machine");
function createPlayer(map, location) {
    let shape = new p2_es_1.Box({ width: constante_1.PADDLE_WIDTH, height: constante_1.PADDLE_HEIGHT });
    shape.collisionGroup = constante_1.PADDLE;
    shape.collisionMask = constante_1.BALL | constante_1.BORDER;
    const player = {
        body: new p2_es_1.Body({ mass: 1, position: [constante_1.PADDLE_POSITION * location, 0] }),
        key: {
            leftward: false,
            rightward: false,
        },
        map,
        location,
        power: false,
        ulti: false,
        powerMedieval: {
            body: undefined,
            isDestroy: false
        },
        ultiMedieval: {
            stones: [
                { body: undefined, isDestroy: false },
                { body: undefined, isDestroy: false },
                { body: undefined, isDestroy: false },
                { body: undefined, isDestroy: false }
            ]
        },
        powerNinja: {
            speedFactor: 1,
            apply: () => {
                player.body.velocity = [0, 0];
            }
        },
        powerWestern: {
            isActive: false,
            apply: () => {
                if (player.powerWestern.isActive) {
                    player.body.velocity[1] = Math.sign(player.body.velocity[1]) * 6;
                    player.powerWestern.isActive = false;
                }
            }
        },
        powerRetro: {},
        step: (delta) => {
            let impulse = [0, 0];
            if (player.key.leftward)
                impulse[1] = constante_1.PADDLE_SPEED * -location * delta;
            if (player.key.rightward)
                impulse[1] = constante_1.PADDLE_SPEED * location * delta;
            player.body.applyForce(impulse);
            player.body.angle = 0;
            player.body.position[0] = constante_1.PADDLE_POSITION * location;
            if (player.power) {
                (map === machine_1.MapTheme.NINJA) && player.powerNinja.apply();
                (map === machine_1.MapTheme.WESTERN) && player.powerWestern.apply();
            }
        },
        reset: () => {
            player.body.position[1] = 0;
            player.body.velocity[1] = 0;
        },
    };
    player.body.addShape(shape);
    player.body.damping = constante_1.PADDLE_DAMPING;
    return player;
}
exports.createPlayer = createPlayer;
//# sourceMappingURL=player.js.map