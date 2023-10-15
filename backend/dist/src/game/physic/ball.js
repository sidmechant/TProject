"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBall = void 0;
const p2_es_1 = require("p2-es");
const constante_1 = require("./constante");
function createBall() {
    const shape = new p2_es_1.Circle({ radius: constante_1.BALL_RADIUS });
    shape.collisionGroup = constante_1.BALL;
    shape.collisionMask = constante_1.PADDLE | constante_1.BORDER | constante_1.STONE;
    const ball = {
        body: new p2_es_1.Body({ mass: 1, position: [0, 0] }),
        counter: 3,
        score: 0,
        impulse: [0, 0],
        start: (emit) => {
            const direction = (ball.score) ? ball.score : (Math.random() - 0.5 < 0) ? -1 : 1;
            ball.score = 0;
            const interval = setInterval(() => {
                emit('counter', ball.counter--);
                if (ball.counter < 0) {
                    clearInterval(interval);
                    ball.impulse = [1 * direction, 0];
                    ball.body.velocity = [3 * direction, 0];
                }
            }, 1000);
            return (direction === -1) ? 0 : 1;
        },
        step: (delta) => {
            if (ball.body.position[0] < -constante_1.PADDLE_POSITION - 2 || ball.body.position[0] > constante_1.PADDLE_POSITION + 2)
                ball.score = (Math.sign(ball.body.position[0]) < 0) ? -1 : 1;
            ball.body.applyForce(ball.impulse);
        },
        reset: () => {
            ball.body.position[0] = 0;
            ball.body.position[1] = 0;
            ball.body.velocity[0] = 0;
            ball.body.velocity[1] = 0;
            ball.counter = 3;
            ball.impulse[0] = 0;
            ball.impulse[1] = 0;
        }
    };
    ball.body.addShape(shape);
    return ball;
}
exports.createBall = createBall;
//# sourceMappingURL=ball.js.map