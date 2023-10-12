import { ReactElement, useEffect } from 'react';
import { RootState, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import Ball from './Ball';
import Player from './Player';
import Area from '../Area';
import Lights from '../Lights';
import IntroAnimation from '../../Animation/IntroAnimation';
import EndAnimation from '../../Animation/EndAnimation';
import { useGame } from '../../../store/hooks/useGame';

export default function World(): ReactElement {
	const { camera } = useThree<RootState>();
	const { state, context } = useGame();

	useEffect(() => {
		if (state === 'Play') {
			if (context.mode === '2PLocal') {
				camera.position.x = 0;
				camera.position.y = -2;
				camera.position.z = 10;
			} else {
				camera.position.x = -8.7;
				camera.position.y = 0;
				camera.position.z = 1.6;
			}
		}
		camera.lookAt(new Vector3(0, 0, 0));
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