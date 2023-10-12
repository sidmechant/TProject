import { Body, Circle } from "p2-es";
import { BALL, BALL_RADIUS, BORDER, PADDLE, PADDLE_POSITION, STONE } from "./constante";
import { Ball, Location } from "../../types/physics";

export function createBall(): Ball {
	const shape: Circle = new Circle({ radius: BALL_RADIUS });
	shape.collisionGroup = BALL;
	shape.collisionMask = PADDLE | BORDER | STONE;

	const ball: Ball = {
		body: new Body({ mass: 1, position: [0, 0] }),
		counter: 3,
		score: 0,
		impulse: [0, 0],
		start: (emit: (type: string | number, ...args: any[]) => boolean): number => {
			const direction: Location = (ball.score) ? ball.score : (Math.random() - 0.5 < 0) ? -1 : 1;
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
		step: (delta: number) => {
			// ball.impulse[0] *= delta;
			// ball.impulse[1] *= delta;
			if (ball.body.position[0] < -PADDLE_POSITION - 2 || ball.body.position[0] > PADDLE_POSITION + 2)
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
