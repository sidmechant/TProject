import styled from 'styled-components';
import { RetroMap } from '../components/GLBtoJSX/Maps';
import { DesertPaddle, MedievalPaddle, NinjaPaddle, RetroPaddle } from '../components/GLBtoJSX/Paddles';
import { DesertBall, MedievalBall, NinjaBall, RetroBall } from '../components/GLBtoJSX/Balls';
import { Noise, EffectComposer, FXAA, Pixelation, Outline, Bloom } from '@react-three/postprocessing';
import { NinjaMap } from '../components/GLBtoJSX/Maps';

import { useMemo, useRef } from 'react';
import { Mesh } from 'three';
import { DissolveMaterial } from '../components/GLBtoJSX/DissolveMaterial';
import * as THREE from 'three';
import { useState } from 'react';
import { set } from 'math/vec2';
import FireShader from '../components/GLBtoJSX/FireShader';
import { useControls } from 'leva';
import FlameShader from '../components/GLBtoJSX/FlamShader';
import { Leva } from 'leva';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lights from '../components/Game/Lights';
import { Environment } from '@react-three/drei';
import { getProject } from '@theatre/core'
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider } from '@theatre/r3f'
import {AnimationUltiMedieval} from '../components/GLBtoJSX/AnimationPower';
// our Theatre.js project sheet, we'll use this later


export const CanvasContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	z-index:1;
	background: #1d792c;
`;


export default function Test() {
	const demoSheet = getProject('Demo Project').sheet('Demo Sheet')
	studio.extend(extension);
	studio.initialize();
	const ref = useRef<THREE.Group>(null);
	const ref2 = useRef<THREE.Group>(null);


	return (
		<CanvasContainer>

			<Canvas
				gl={{ preserveDrawingBuffer: true }}>
				<SheetProvider sheet={demoSheet}>
					<Lights />
					{/* <NinjaPaddle
					
				/> */}
					{/* <DesertPaddle/> */}
					{/* <Environment preset="sunset" /> */}
					<OrbitControls />
					{/* <DisapearingAnimation> */}
					{/* <MedievalMap /> */}
					{/* <MedievalBall /> */}
					{/* <DesertBall /> */}
					{/* <e.mesh theatreKey="Cube"> */}
						{/* <boxGeometry args={[10, 10, 10]} /> */}
						{/* <meshBasicMaterial color="red" /> */}
					{/* </e.mesh> */}
						{/* <RetroBall body={ref} position={{x:0,y:0,z:0}} velocity={{x:1,y:0,z:0}} /> */}
					<e.group theatreKey="skull" rotation={[-Math.PI / 2, 0, 0]} position={[4, 0, 0]}>
					<AnimationUltiMedieval />
					</e.group>
					{/* <group rotation={[Math.PI/2,0,0]}> */}
					{/* <NinjaBall body={ref2} position={{ x: 0, y: 0, z: 0 }} velocity={{ x: 1, y: 1, z: 1 }} /> */}
					{/* </group> */}
					{/* <NinjaPaddle /> */}
					{/* <NinjaBall /> */}
					{/* <MedievalPaddle /> */}
					{/* <DesertPaddle /> */}
					{/* </DisapearingAnimation> */}
					{/* <MyMesh /> */}
					{/* <RetroPaddle /> */}
					{/* <NinjaMap /> */}
					
					{/* <RetroBall /> */}
					{/* <Box  position={[0, 0, 0]}/> */}
					<EffectComposer multisampling={0}>
					<FXAA />
					<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={0} />
				</EffectComposer>
				</SheetProvider >
				{/* <ambientLight intensity={3.5} /> */}
			</Canvas>
		</CanvasContainer>
	);
}