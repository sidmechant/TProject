import { EventEmitter } from 'events';
import { Ball, Player, Power, Vector3, World } from '../types/physics';
import { createBall } from './ball';
import { createPlayer } from './player';
import { createWorld } from './world';
import { MapTheme } from '../types/machine';
import createStone from './stone';
import { BALL_RADIUS, MAP_HEIGHT, PADDLE_POSITION } from './constante';

export class Physic extends EventEmitter {
	private ball: Ball;
	private players: Player[] = [];
	private world: Required<World>;

	constructor(playerNeg: MapTheme, playerPos: MapTheme) {
		super();
		this.ball = createBall();
		this.players.push(createPlayer(playerNeg, -1));
		this.players.push(createPlayer(playerPos, 1));
		this.world = createWorld({
			ball: this.ball,
			playerNeg: this.players[0],
			playerPos: this.players[1],
		});
		this.emit = this.emit.bind(this);
		this.getSkillInfo = this.getSkillInfo.bind(this);
	};

	private getSkillInfo(index: number): Power {
		const player = this.players[index];

		if (player.map === MapTheme.MEDIEVAL) {
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
		} else if (player.map === MapTheme.NINJA) {
			return {
				power: {
					factor: (player.powerNinja.speedFactor - 1) * 2
				},
				ulti: {}
			};
		} else if (player.map === MapTheme.WESTERN) {
			return {
				power: {
					isActive: player.powerWestern.isActive
				},
				ulti: {}
			};
		} else if (player.map === MapTheme.RETRO) {
			return {
				power: {
					isActive: player.power
				},
				ulti: {}
			};
		} else {
			return {};
		}
	};

	public pause() {
		this.world.pause();
	};

	public play() {
		this.world.play();
	};

	public setKeys(index: number, key: Player['key']) {
		this.players[index].key = key;
	};

	public setPower(index: number, power: boolean): void {
		const player = this.players[index];
		if (player.map === MapTheme.MEDIEVAL) {
			if (power && !player.power
				&& !player.powerMedieval.body
				&& Math.sign(player.body.position[1])) {
				const locationX = player.location;
				const locationY = Math.sign(player.body.position[1]) as -1 | 1;
				const left = 1 * locationX - 0.3;
				const right = 1 * locationX + 0.3;
				const top = (MAP_HEIGHT / 4 * locationY) - 0.3;
				const bottom = (MAP_HEIGHT / 4 * locationY) + 0.3;

				if (this.ball.body.position[0] + BALL_RADIUS <= left || this.ball.body.position[0] - BALL_RADIUS >= right ||
					this.ball.body.position[1] + BALL_RADIUS <= top || this.ball.body.position[1] - BALL_RADIUS >= bottom) {
					player.power = true;
					player.powerMedieval = {
						body: createStone(0.5, 0.5, 1, MAP_HEIGHT / 4, locationX, locationY),
						isDestroy: false
					}
					this.world.addBody(player.powerMedieval.body!);
				}
				// console.log('stone jutstu');
			}
		}
		if (player.map === MapTheme.WESTERN) {
			if (power && !player.power && Math.abs(player.body.velocity[1]) > 1) {
				player.power = true;
				player.powerWestern.isActive = true;
				setTimeout(() => {
					player.power = false;
				}, 2000);
			}
		}
		if (player.map === MapTheme.NINJA) {
			player.power = power;
			if (player.power && player.powerNinja.speedFactor < 1.5) {
				player.powerNinja.speedFactor += 0.01;
			} else if (player.powerNinja.speedFactor > 1) {
				player.powerNinja.speedFactor -= 0.02;
			}
			// console.log(player.powerNinja.speedFactor);
		}
		if (player.map === MapTheme.RETRO) {
			if (power && !player.power) {
				player.power = true;
				setTimeout(() => {
					player.power = false;
				}, 5000);
			}
		}
	};

	public setUlti(index: number, ulti: boolean): void {
		const player = this.players[index];
		if (player.map === MapTheme.MEDIEVAL) {
			if (!player.ulti && ulti) {
				const x = PADDLE_POSITION + 0.5;
				const locationX = player.location;
				player.ulti = ulti;
				for (let i = 0; i < 4; i++) {
					const y = MAP_HEIGHT * 0.25 * i - MAP_HEIGHT * 0.375;
					player.ultiMedieval.stones[i] = {
						body: (createStone(0.2, 1, x, y, locationX, 1)),
						isDestroy: false
					};
					this.world.addBody(player.ultiMedieval.stones[i].body!);
				}
			}
		}
	};

	public start(): number {
		this.players.forEach(p => p.reset());
		return this.ball.start(this.emit);
	};

	public stop(): void {
		this.world.stop();
	};

	get ballPosition(): Vector3 {
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
	};

	get ballVelocity(): Vector3 {
		return { x: this.ball.body.velocity[0], y: this.ball.body.velocity[1], z: 0 };
	};

	get collisions(): Required<World>['collisions'] {
		return this.world.collisions;
	};

	get playersPosition(): Vector3[] {
		return [
			{ x: this.players[0].body.position[0], y: this.players[0].body.position[1], z: 0 },
			{ x: this.players[1].body.position[0], y: this.players[1].body.position[1], z: 0 }
		];
	};

	get playersVelocity(): Vector3[] {
		return [
			{ x: this.players[0].body.velocity[0], y: this.players[0].body.velocity[1], z: 0 },
			{ x: this.players[1].body.velocity[0], y: this.players[1].body.velocity[1], z: 0 }
		];
	};

	get skillInfo(): [Power, Power] {
		return [
			this.getSkillInfo(0),
			this.getSkillInfo(1)
		];
	}

	get powerIsActive(): [boolean, boolean] {
		return [
			this.players[0].power,
			this.players[1].power
		]
	}
};