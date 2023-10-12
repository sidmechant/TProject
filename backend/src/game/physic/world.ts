import * as P2 from 'p2-es';
import createBorder from './border';
import { FPS, PADDLE_POSITION } from './constante';
import { Ball, Player, World } from '../types/physics';

export function createWorld({
	ball,
	playerNeg,
	playerPos
}: {
	ball: Ball,
	playerNeg: Player,
	playerPos: Player
}): Required<World> {

	const world: World = new P2.World({ gravity: [0, 0] });
	world.addBody(ball.body);
	world.addBody(playerNeg.body);
	world.addBody(playerPos.body);
	world.addBody(createBorder(-1));
	world.addBody(createBorder(1));

	/* ---------- Interval ---------- */
	const step = () => {
		ball.step(FPS)
		playerNeg.step(FPS)
		playerPos.step(FPS)
		world.step(FPS);

		const isDestroy = (): Player['powerMedieval'][] => {
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
				if (stone.isDestroy) destroy.push(stone);
			}
			for (const stone of playerPos.ultiMedieval.stones) {
				if (stone.isDestroy) destroy.push(stone);
			}
			return destroy;
		}
		isDestroy().forEach(stone => {
			world.removeBody(stone.body!);
			stone.body = undefined;
			stone.isDestroy = false;
		});
	};
	world.interval = setInterval(step, FPS * 1000);

	/* ---------- Collision ---------- */
	world.collisions = {
		paddle: [0, 0],
		border: 0,
		stone: 0
	};

	const handlePaddleCollision = (paddle: P2.Body) => {
		const speedFactor = playerNeg.powerNinja.speedFactor * playerPos.powerNinja.speedFactor;
		playerNeg.powerNinja.speedFactor = 1;
		playerPos.powerNinja.speedFactor = 1;

		world.collisions!.paddle[paddle === playerNeg.body ? 0 : 1] += 1;
		const collisionPoint: number = ball.body.position[1] - paddle.position[1];
		ball.impulse[0] = (1 - Math.abs(collisionPoint)) * Math.sign(ball.impulse[0] * -1);
		ball.impulse[1] = (ball.body.position[1] > 2.16 || ball.body.position[1] < -2.16) ? -collisionPoint : collisionPoint;
		ball.body.velocity[0] *= -1 * speedFactor;
		ball.body.velocity[1] = ball.impulse[1] * 5 * speedFactor;
		return;
	};

	const handleBorderCollision = () => {
		world.collisions!.border += 1;
		ball.impulse[1] *= -1;
		ball.body.velocity[1] *= -1;
		return;
	};

	const handleStoneCollision = (stone: Player['powerMedieval']) => {
		world.collisions!.stone += 1;
		const dx = ball.body.position[0] - stone.body!.position[0];
		const dy = ball.body.position[1] - stone.body!.position[1];

		if (PADDLE_POSITION > Math.abs(stone.body!.position[0]) && Math.abs(dy) > Math.abs(dx)) {
			ball.impulse[1] *= -1;
			ball.body.velocity[1] *= -1;
		} else {
			if (Math.sign(ball.impulse[0]) === stone.body!.position[0]) {
				ball.impulse[0] *= -1;
				ball.body.velocity[0] *= -1;
			}
		}
		stone.isDestroy = true;
		return;
	};

	const handleBeginContact = (event: P2.BeginContactEvent) => {
		const isStone = (body: P2.Body): Player['powerMedieval'] | undefined => {
			if (body === playerNeg.powerMedieval.body)
				return playerNeg.powerMedieval;
			if (body === playerPos.powerMedieval.body)
				return playerPos.powerMedieval;
			for (const stone of playerNeg.ultiMedieval.stones) {
				if (body === stone.body) return stone;
			}
			for (const stone of playerPos.ultiMedieval.stones) {
				if (body === stone.body) return stone;
			}
			return undefined;
		}
		if ((event.bodyA === ball.body && (event.bodyB === playerNeg.body || event.bodyB === playerPos.body))
			|| ((event.bodyA === playerNeg.body || event.bodyA === playerPos.body) && event.bodyB === ball.body)) {
			handlePaddleCollision((event.bodyA !== ball.body) ? event.bodyA : event.bodyB);
		} else if ((event.bodyA === ball.body && isStone(event.bodyB)) || (isStone(event.bodyA) && event.bodyB === ball.body)) {
			handleStoneCollision((event.bodyA !== ball.body) ? isStone(event.bodyA)! : isStone(event.bodyB)!);
		} else if (event.bodyA === ball.body || event.bodyB === ball.body) {
			handleBorderCollision();
		}
		return;
	};
	world.on('beginContact', handleBeginContact);

	/* ---------- Function ---------- */
	world.play = () => {
		world.interval = setInterval(step, FPS * 1000);
	};

	world.pause = () => {
		clearInterval(world.interval);
	};

	world.stop = () => {
		clearInterval(world.interval);
		world.off('beginContact', handleBeginContact);
		world.clear();
	};

	return world as Required<World>;
}
