import { ReactElement, useEffect } from 'react';
import { RootState, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import Ball from './Ball';
import Player from './Player';
import Area from '../Area';
import Lights from '../Lights';
import IntroAnimation from '../../Animation/IntroAnimation';
import EndAnimation from '../../Animation/EndAnimation';
import { client } from '../../../data/Client';
import { useGame } from '../../../store/hooks/useGame';

export default function World(): ReactElement {
	const { camera } = useThree<RootState>();
	const { state, context, send } = useGame();

	useEffect(() => {
		if (state === 'Play') {
			camera.position.x = 8.7 * (context.players[0].location as -1 | 1);
			camera.position.y = 0;
			camera.position.z = 1.6;
			camera.lookAt(new Vector3(0, 0, 0));
		}
		client.socket?.on('end', () => {
			console.log('Server: event: end');
			send({ type: 'end' });
		});

		return () => {
			client.socket?.off('end');
		}
	}, [state]);

	return <>
		{context.animation === 'Intro' && <IntroAnimation />}
		{context.animation === 'End' && <EndAnimation />}
		{context.animation !== 'Intro' && <Area />}
		<Lights />
		{context.animation !== 'Intro' && <Player />}
		{state === 'Play' && <Ball />}
	</>;
}