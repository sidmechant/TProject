import { Body, Box } from 'p2-es';

import { BALL, STONE } from './constante';
import { Location } from '../../types/physics'

export default function createStone(width: number, height: number, x: number, y: number, locationX: Location, locationY: Location): Body {
	let shape: Box = new Box({ width, height });
	shape.collisionGroup = STONE;
	shape.collisionMask = BALL;

	let body: Body = new Body({ mass: 0, position: [x * locationX, y * locationY] });
	body.addShape(shape);
	return body;
}