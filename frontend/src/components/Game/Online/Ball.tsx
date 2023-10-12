import { ReactElement, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { client } from '../../../data/Client';
import { Position } from '../../../store/Player'
import { useGame } from '../../../store/hooks/useGame';

interface Physic {
	position: Position,
	velocity: Position
}

export default function Ball(): ReactElement {
	const { context, state } = useGame();
	const [physic, setPhysic] = useState<Physic>({
		position: { x: 0, y: 0, z: 0 },
		velocity: { x: 0, y: 0, z: 0 }
	});
	const bodyPlayer = useRef<Group>(null);
	const bodyOpponent = useRef<Group>(null);
	const [counter, setCounter] = useState<number>(3);
	const BallPlayer = context.players[0].Ball();
	const BallOpponent = context.players[1].Ball();

	useEffect(() => {
		client.socket?.on('ball', (ball: Physic) => {
			setPhysic(ball)
		});
		client.socket?.on('counter', ({ counter }: { counter: number }) => {
			setCounter(counter);
			console.log(counter);
		});

		return () => {
			client.socket?.off('ball');
			client.socket?.off('counter');
		}
	}, [client.socket]);

	useFrame(() => {
		if (state === 'Play')
			client.socket?.emit('ball');
	});

	return <>
		{
			(context.current!.id === 'j1')
				? <BallPlayer body={bodyPlayer} position={physic.position} velocity={physic.velocity} />
				: <BallOpponent body={bodyOpponent} position={physic.position} velocity={physic.velocity} />
		}
	</>;
}