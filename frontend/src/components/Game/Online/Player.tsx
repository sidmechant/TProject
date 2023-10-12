import { ReactElement, useEffect, useRef, useState } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import ScoreAnimation from '../../Animation/ScoreAnimation';
import UltiAnimation from '../../Animation/UltiAnimation';
import { client } from '../../../data/Client';
import { useGame } from '../../../store/hooks/useGame';
import { Position } from '../../../store/Player';
import { Power } from '../../../types/physics';

interface Physic {
	players: {
		position: Position,
		velocity: Position,
		skillInfo: Power,
		collision: number,
		cooldown: number
	}[]
};

export default function Player(): ReactElement {
	const { state, context, send } = useGame();
	const [physic, setPhysic] = useState<Physic>({
		players: [{
			position: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			skillInfo: {},
			collision: 0,
			cooldown: 0
		}, {
			position: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			skillInfo: {},
			collision: 0,
			cooldown: 0
		}]
	});
	const [index, setIndex] = useState<number>(context.players.findIndex(p => p.id === context.current!.id));
	const player = context.players[0];
	const opponent = context.players[1];
	const bodyPlayer = useRef<Group>(null);
	const bodyOponent = useRef<Group>(null);
	const PaddlePlayer = player.Paddle();
	const PaddleOpponent = opponent.Paddle();
	const [_, getKeys] = useKeyboardControls<string>();

	useEffect(() => {
		client.socket?.on('players', (players: Physic) => {
			setPhysic(players);
			// console.log(players.players[0].cooldown);
		});
		client.socket?.on('score', (data: { index: number }) => { // TMP - Changer Back
			setIndex(index);
			send({ type: 'score', index: data.index });
			console.log('Server: event: score');
		});
		client.socket?.on('ulti', () => {
			setIndex(1);
			send({ type: 'ulti', id: 'j2' });
		});

		return () => {
			client.socket?.off('players');
			client.socket?.off('score');
		}
	}, [client.socket]);

	useFrame(() => {
		if (state === 'Play') {
			const { leftward, rightward, ulti, power } = getKeys();
			if (ulti) {
				setIndex(0);
				send({ type: 'ulti', id: 'j1' });
			}
			client.socket?.emit('move', { key: { leftward, rightward, ulti, power } });
		}
	});


	useEffect(() => { // TMP
		console.log(player.score, opponent.score)
	}, [player.score, opponent.score])

	return <>
		{context.animation === 'Score' && <ScoreAnimation index={index} />}
		{context.animation === 'Ulti' && <UltiAnimation index={index} />}
		<PaddlePlayer
			isMe={true}
			body={bodyPlayer}
			position={physic.players[0].position}
			velocity={physic.players[0].velocity}
			location={context.players[0].location!}
			skillInfo={physic.players[0].skillInfo}
			collision={physic.players[0].collision} />
		<PaddleOpponent
			isMe={false}
			body={bodyOponent}
			position={physic.players[1].position}
			velocity={physic.players[1].velocity}
			location={context.players[1].location!}
			skillInfo={physic.players[1].skillInfo}
			collision={physic.players[1].collision} />
	</>;
}