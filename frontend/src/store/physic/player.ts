import { Body, Box } from 'p2-es';

import { BALL, BORDER, PADDLE, PADDLE_DAMPING, PADDLE_HEIGHT, PADDLE_POSITION, PADDLE_SPEED, PADDLE_WIDTH } from './constante';
import { Player } from '../../types/physics'
import { MapTheme } from '../../types/machine';

export function createPlayer(map: MapTheme, location: Player['location']): Player {
	let shape: Box = new Box({ width: PADDLE_WIDTH, height: PADDLE_HEIGHT });
	shape.collisionGroup = PADDLE;
	shape.collisionMask = BALL | BORDER;

	const player: Player = {
		body: new Body({ mass: 1, position: [PADDLE_POSITION * location, 0] }),
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
					player.body.velocity[1] = Math.sign(player.body.velocity[1]) * 12;
					player.powerWestern.isActive = false;
				}
			}
		},
		powerRetro: {},
		step: (delta: number): void => {
			let impulse: number[] = [0, 0];

			if (player.key.leftward)
				impulse[1] = PADDLE_SPEED * -location * delta;
			if (player.key.rightward)
				impulse[1] = PADDLE_SPEED * location * delta;
			if (player.power) {
				(map === MapTheme.NINJA) && player.powerNinja.apply();
				(map === MapTheme.WESTERN) && player.powerWestern.apply();
			}
			player.body.applyForce(impulse);
			player.body.angle = 0;
			player.body.position[0] = PADDLE_POSITION * location;
		},
		reset: () => {
			player.body.position[1] = 0;
			player.body.velocity[1] = 0;
		},
	};
	player.body.addShape(shape);
	player.body.damping = PADDLE_DAMPING;

	return player;
}
