import { ReactElement, ReactNode } from 'react';
import { KeyboardControls } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import styled from 'styled-components';
import Debug from '../Debug';

export const CanvasContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	z-index:1;
`;

export default function Canvas({ children }: { children: ReactNode }): ReactElement {

	return <KeyboardControls map={[
		{ name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
		{ name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
		{ name: 'power', keys: ['Space'] },
		{ name: 'power2', keys: ['ShiftRight'] },
		{ name: 'ulti', keys: ['KeyR'] },
		{ name: 'ulti2', keys: ['Enter'] },
		{ name: 'keyUpward', keys: ['KeyW'] },
		{ name: 'keyDownward', keys: ['KeyS'] },
		{ name: 'arrowUpward', keys: ['ArrowUp'] },
		{ name: 'arrowDownward', keys: ['ArrowDown'] }
	]}>
		<CanvasContainer>
			<ThreeCanvas
				shadows
				camera={{
					fov: 45,
					near: 0.1,
					far: 50,
					position: [0, 0, 1],
					// position: [0, 10, 10],
					up: [0, 0, 1]
				}}>
				<Debug controls={true} axes={false} />
				{children}
			</ThreeCanvas>
		</CanvasContainer>
	</KeyboardControls>;
}