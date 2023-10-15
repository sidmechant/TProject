"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorld = void 0;
const P2 = require("p2-es");
const border_1 = require("./border");
const constante_1 = require("./constante");
function createWorld({ ball, playerNeg, playerPos }) {
    const world = new P2.World({ gravity: [0, 0] });
    world.addBody(ball.body);
    world.addBody(playerNeg.body);
    world.addBody(playerPos.body);
    world.addBody((0, border_1.default)(-1));
    world.addBody((0, border_1.default)(1));
    const step = () => {
        ball.step(constante_1.FPS);
        playerNeg.step(constante_1.FPS);
        playerPos.step(constante_1.FPS);
        world.step(constante_1.FPS);
        const isDestroy = () => {
            let destroy = [];
            if (playerNeg.powerMedieval.isDestroy) {
                playerNeg.power = false;
                destroy.push(playerNeg.powerMedieval);
            }
            if (playerPos.powerMedieval.isDestroy) {
                playerPos.power = false;
                destroy.push(playerPos.powerMedieval);
            }
            for (const stone of playerNeg.ultiMedieval.stones) {
                if (stone.isDestroy)
                    destroy.push(stone);
            }
            for (const stone of playerPos.ultiMedieval.stones) {
                if (stone.isDestroy)
                    destroy.push(stone);
            }
            return destroy;
        };
        isDestroy().forEach(stone => {
            world.removeBody(stone.body);
            stone.body = undefined;
            stone.isDestroy = false;
        });
    };
    world.interval = setInterval(step, constante_1.FPS * 1000);
    world.collisions = {
        paddle: [0, 0],
        border: 0,
        stone: 0
    };
    const handlePaddleCollision = (paddle) => {
        const speedFactor = playerNeg.powerNinja.speedFactor * playerPos.powerNinja.speedFactor;
        playerNeg.powerNinja.speedFactor = 1;
        playerPos.powerNinja.speedFactor = 1;
        world.collisions.paddle[paddle === playerNeg.body ? 0 : 1] += 1;
        const collisionPoint = ball.body.position[1] - paddle.position[1];
        ball.impulse[0] = (1 - Math.abs(collisionPoint)) * Math.sign(ball.impulse[0] * -1);
        ball.impulse[1] = (ball.body.position[1] > 2.16 || ball.body.position[1] < -2.16) ? -collisionPoint : collisionPoint;
        ball.body.velocity[0] *= -1 * speedFactor;
        ball.body.velocity[1] = ball.impulse[1] * 5 * speedFactor;
        return;
    };
    const handleBorderCollision = () => {
        world.collisions.border += 1;
        ball.impulse[1] *= -1;
        ball.body.velocity[1] *= -1;
        return;
    };
    const handleStoneCollision = (stone) => {
        world.collisions.stone += 1;
        const dx = ball.body.position[0] - stone.body.position[0];
        const dy = ball.body.position[1] - stone.body.position[1];
        if (constante_1.PADDLE_POSITION > Math.abs(stone.body.position[0]) && Math.abs(dy) > Math.abs(dx)) {
            ball.impulse[1] *= -1;
            ball.body.velocity[1] *= -1;
        }
        else {
            if (Math.sign(ball.impulse[0]) === stone.body.position[0]) {
                ball.impulse[0] *= -1;
                ball.body.velocity[0] *= -1;
            }
        }
        stone.isDestroy = true;
        return;
    };
    const handleBeginContact = (event) => {
        const isStone = (body) => {
            if (body === playerNeg.powerMedieval.body)
                return playerNeg.powerMedieval;
            if (body === playerPos.powerMedieval.body)
                return playerPos.powerMedieval;
            for (const stone of playerNeg.ultiMedieval.stones) {
                if (body === stone.body)
                    return stone;
            }
            for (const stone of playerPos.ultiMedieval.stones) {
                if (body === stone.body)
                    return stone;
            }
            return undefined;
        };
        if ((event.bodyA === ball.body && (event.bodyB === playerNeg.body || event.bodyB === playerPos.body))
            || ((event.bodyA === playerNeg.body || event.bodyA === playerPos.body) && event.bodyB === ball.body)) {
            handlePaddleCollision((event.bodyA !== ball.body) ? event.bodyA : event.bodyB);
        }
        else if ((event.bodyA === ball.body && isStone(event.bodyB)) || (isStone(event.bodyA) && event.bodyB === ball.body)) {
            handleStoneCollision((event.bodyA !== ball.body) ? isStone(event.bodyA) : isStone(event.bodyB));
        }
        else if (event.bodyA === ball.body || event.bodyB === ball.body) {
            handleBorderCollision();
        }
        return;
    };
    world.on('beginContact', handleBeginContact);
    world.play = () => {
        world.interval = setInterval(step, constante_1.FPS * 1000);
    };
    world.pause = () => {
        clearInterval(world.interval);
    };
    world.stop = () => {
        clearInterval(world.interval);
        world.off('beginContact', handleBeginContact);
        world.clear();
    };
    return world;
}
exports.createWorld = createWorld;
//# sourceMappingURL=world.js.map