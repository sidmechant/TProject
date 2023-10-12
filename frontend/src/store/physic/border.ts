import { Body, Box } from 'p2-es';

import { BALL, BORDER, MAP_HEIGHT, MAP_WIDTH, OFFSET, PADDLE } from './constante';
import { Location } from '../../types/physics'

export default function createBorder(location: Location): Body {
	let shape: Box = new Box({ width: MAP_WIDTH * 2, height: OFFSET * 2 });
	shape.collisionGroup = BORDER;
	shape.collisionMask = BALL | PADDLE;

	let body: Body = new Body({ mass: 0, position: [0, (MAP_HEIGHT / 2 + OFFSET) * location] });
	body.addShape(shape);
	return body;
}