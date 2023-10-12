import { ReactElement, useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useGame } from '../../../store/hooks/useGame';
import { Position } from '../../../store/Player';
import { useFrame } from '@react-three/fiber';

interface Physic {
	position: Position,
	velocity: Position
}
export default function Ball(): ReactElement {
	const { context } = useGame();
	const [physic, setPhysic] = useState<Physic>({
		position: { x: 0, y: 0, z: 0 },
		velocity: { x: 0, y: 0, z: 0 }
	});
	const bodyPlayer = useRef<Group>(null);
	const bodyOpponent = useRef<Group>(null);
	const [counter, setCounter] = useState<number>(3);
	const BallPlayer = context.players[0].Ball();
	const BallOpponent = context.players[1].Ball();

	if (Ball === undefined)
		return <></>;

	const handleCounter = (counter: number): void => {
		setCounter(counter);
		console.log('counter:', counter);
	}

	useEffect(() => {
		context.physic!.on('counter', handleCounter);
		return () => {
			context.physic!.off('counter', handleCounter);
		}
	}, []);

	useFrame(() => {
		setPhysic({
			position: context.physic!.ballPosition,
			velocity: context.physic!.ballVelocity,
		})
	})

	return <>
		{
			(context.current!.id === 'j1')
				? <BallPlayer body={bodyPlayer} position={physic.position} velocity={physic.velocity} />
				: <BallOpponent body={bodyOpponent} position={physic.position} velocity={physic.velocity} />
		}
	</>;
}