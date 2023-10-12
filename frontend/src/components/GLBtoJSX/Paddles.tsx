import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { PropsJsxPaddle } from '../../types/Map'
import { GLTFResult } from '../../types/Map'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../../store/hooks/useGame'
import { AnimationSkillDesert } from './AnimationPower'
import WindShader from './WindShader'
import { NinjaSkill, RetroSkill, WesternSkill } from '../../types/physics'
import gsap from 'gsap'
import chroma from 'chroma-js'
import { set } from 'math/vec2'
import FlameShader from './FlamShader'

type GLTFResultRetroPaddle = GLTF & {
	nodes: {
		Cube330: THREE.Mesh
		Cube330_1: THREE.Mesh
		Cube330_2: THREE.Mesh
		Cube330_3: THREE.Mesh
	}
	materials: {
		['Material.018']: THREE.MeshStandardMaterial
		['Material.016']: THREE.MeshStandardMaterial
		['Material.017']: THREE.MeshStandardMaterial
		['Material.019']: THREE.MeshStandardMaterial
	}
}

const hexToRgb = (hex: string | undefined): [number, number, number] | undefined => {
	// Retirer le caractère "#" si présent
	if (hex === undefined) return undefined;
	hex = hex.replace(/^#/, '');

	// Convertir les valeurs hexadécimales en valeurs entières
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return [r, g, b];
};

export function NinjaPaddle({ body, position, velocity, location, skillInfo, collision }: PropsJsxPaddle) {
	const { nodes, materials } = useGLTF('./assets/balls&paddles/Balls&Paddles.glb') as GLTFResult;
	const [index, setIndex] = useState(0);
	const [isPowerActif, setIsPowerActif] = useState(false);
	const colorScale = chroma.scale(["red", "blue"]);
	useEffect(() => {


		if (collision && body.current) {
			gsap.to(body.current.rotation, {
				duration: 0.15,
				y: body.current.rotation.y + Math.PI / 2,
				ease: "slow(0.7, 0.7, false)",
				repeat: 1,
				yoyo: true,
			});
		}
	}, [collision])


	useFrame((delta) => {
		if ((skillInfo as NinjaSkill)) {
			if ((skillInfo as NinjaSkill).power.factor < 0.9)
				setIndex((skillInfo as NinjaSkill).power.factor);
			// console.log((skillInfo as NinjaSkill).power.factor);
		}

		if (body.current) {
			body.current.rotation.x = Math.sin(delta.clock.elapsedTime) / 10;
			body.current.position.x = Math.sin(delta.clock.elapsedTime) / 10;
			body.current.position.y = Math.cos(delta.clock.elapsedTime) / 10;
		}
	});

	useEffect(() => {
		if ((skillInfo as NinjaSkill)) {
			if ((skillInfo as NinjaSkill).power.isActive) {
				setIsPowerActif(true);
			} else {
				setIsPowerActif(false);
				setIndex(0);
			}
		}
	}, [(skillInfo as NinjaSkill)])

	useFrame((delta) => {
		if ((skillInfo as NinjaSkill)) {
			if (isPowerActif) {
				if ((skillInfo as NinjaSkill).power.factor < 0.9)
					setIndex((skillInfo as NinjaSkill).power.factor);
			}
		}

		if (body.current) {

			body.current.rotation.x = Math.sin(delta.clock.elapsedTime) / 10;
			body.current.position.z = Math.sin(delta.clock.elapsedTime) / 10;
			body.current.position.y = Math.cos(delta.clock.elapsedTime);
			body.current.rotation.y -= Math.sin(delta.clock.elapsedTime) * 0.005;
			body.current.rotation.x += (-velocity.y * 0.05 - body.current.rotation.x) * 0.1;
			body.current.position.setY(position.y);
			body.current.position.setX(position.x);
			// body.current.position.setZ(position.z);
		}
	});

	return (
		<>
			<group ref={body}>
				{
					isPowerActif &&
					<>
						<FlameShader position={[0, 0, 0.5]} scale={[0.6, 0.2, index * 2]} rotation={[-Math.PI / 2, 0, 0]} color1={colorScale(index).rgb()} />
						<WindShader position={[0, 0, -0.18]} scale={[0.3, 0.2, 0.9]} rotation={[Math.PI / 2, 0, 0]} color1={colorScale(index).rgb()} />
					</>
				}
				<group scale={0.00005} position={[0, 0, 0]} rotation={[0, 0, location * Math.PI / 2]} dispose={null}>
					<mesh geometry={nodes.Eventail.geometry} material={materials.Material__25} castShadow />
				</group>
			</group>
		</>
	)
}

export function MedievalPaddle({ body, position, velocity, location }: PropsJsxPaddle) {
	const { nodes, materials } = useGLTF('./assets/balls&paddles/Balls&Paddles.glb') as GLTFResult;

	const refWheel = useRef<THREE.Mesh>(null);
	const refWheel2 = useRef<THREE.Mesh>(null);
	const refChains = useRef<THREE.Mesh>(null);
	const refChains2 = useRef<THREE.Mesh>(null);
	const refRam = useRef<THREE.Mesh>(null);

	useFrame(() => {
		if (refWheel.current && refWheel2.current && refChains.current && refChains2.current && refRam.current) {
			refWheel.current.rotation.y += velocity.y / 4 * -location;
			refWheel2.current.rotation.y += velocity.y / 4 * -location;
			refChains.current.rotation.y += (velocity.y / 6 - refChains.current.rotation.y) * 0.1;
			refChains2.current.rotation.y += (velocity.y / 6 - refChains2.current.rotation.y) * 0.1;
			refRam.current.position.y += (Math.abs(velocity.y) / 6 + 4.321 - refRam.current.position.y) * 0.1;
			refRam.current.position.x += (-velocity.y - refRam.current.position.x) * 0.1;
		}
		if (body.current)
			body.current.position.set(position.x, position.y, position.z);
	});

	return (
		<>
			<group ref={body}>
				<group scale={0.047} rotation={[Math.PI / 2, -Math.PI / 2 * location, 0]} dispose={null} position={[0, 0, -0.23]}>
					<mesh geometry={nodes.Belier_Tronc_Top.geometry} material={materials.Material__25} position={[0, 12.587, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} />
					<mesh geometry={nodes.Belier.geometry} material={materials.Material__25} position={[0.05, 6.238, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
					<group>{/* chaines */}
						<mesh ref={refChains} geometry={nodes.Belier_Chaine.geometry} material={materials.Material__25} position={[5.947, 11.5, 0.011]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} />
						<mesh ref={refChains2} geometry={nodes.Belier_Chaine01.geometry} material={materials.Material__25} position={[-5.947, 11.5, 0.011]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} />
					</group>
					<group>{/* tronc avec beliers */}
						<mesh ref={refRam} geometry={nodes.Belier_Belier.geometry} material={materials.Material__25} position={[0, 4.321, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
					</group>
					<group>{/* roue droite */}
						<mesh ref={refWheel} geometry={nodes.Belier_Roue.geometry} material={materials.Material__25} position={[8.655, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
					</group>
					<group>{/* roue gauche */}
						<mesh ref={refWheel2} geometry={nodes.Belier_Roue02.geometry} material={materials.Material__25} position={[-8.655, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
					</group>
				</group>
			</group>
		</>
	)
}

export function DesertPaddle({ body, position, velocity, location, skillInfo }: PropsJsxPaddle) {
	const { nodes, materials } = useGLTF('./assets/balls&paddles/Balls&Paddles.glb') as GLTFResult;
	// const [power, setPower] = useState<boolean>(false);

	const refWheel = useRef<THREE.Mesh>(null);
	const refWheel2 = useRef<THREE.Mesh>(null);
	const refRouage = useRef<THREE.Mesh>(null);
	const refLeverage = useRef<THREE.Mesh>(null);
	const refTige = useRef<THREE.Mesh>(null);

	useFrame(() => {
		if (velocity.y) {
			if (refWheel.current && refWheel2.current && refRouage.current && refLeverage.current && refTige.current) {
				refWheel.current.rotation.y += velocity.y / 4 * -location;
				refWheel2.current.rotation.y += velocity.y / 4 * -location;
				refRouage.current.rotation.y = velocity.y * 0.1 + 0.25;
				refLeverage.current.rotation.y += (velocity.y * 0.1 + 0.25 - refLeverage.current.rotation.y) * 0.1;
				refTige.current.position.y = -velocity.y / 2 + 2;
			}
		}
		if (body.current)
			body.current.position.y = position.y;
	});

	return (
		<group ref={body} position={[5 * location, 0, 0]}>
			<group rotation={[Math.PI / 2, -Math.PI / 2 * location, 0]} scale={[0.052, 0.05, 0.04]} position={[0, 0, -0.28]}>
				<group>
					{(skillInfo) && <AnimationSkillDesert isUltiUsed={(skillInfo as WesternSkill).power.isActive} refPaddle={body} velocity={velocity.y} />}
				</group>
				<mesh geometry={nodes.Handcar.geometry} material={materials.Material__25} position={[-0.004, 5.142, -0.027]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
				<group>{/*tige relou a animer */}
					<mesh ref={refTige} geometry={nodes.Handcar_Tige.geometry} material={materials.Material__25} position={[24.96, 1.901, 0]} scale={0.01} />
				</group>
				<group>{/* rouage */}
					<mesh ref={refRouage} geometry={nodes.Handcar_Rouage.geometry} material={materials.Material__25} position={[-1.245, 2.033, -0.026]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} />
				</group>
				<group >{/* levier */}
					<mesh ref={refLeverage} geometry={nodes.Handcar_Baton.geometry} material={materials.Material__25} position={[-0.022, 10.317, -0.026]} rotation={[-Math.PI / 2, 0.25, 0]} scale={0.001} />
				</group>
				<group >{/* roue droite */}
					<mesh ref={refWheel} geometry={nodes.Handcar_Roue.geometry} material={materials.Material__25} position={[5.108, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
				</group>
				<group>{/* roue gauche */}
					<mesh ref={refWheel2} geometry={nodes.Handcar_Roue02.geometry} material={materials.Material__25} position={[-5.108, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001} castShadow />
				</group>
			</group>

		</group >
	)
}

export function RetroPaddle({ isMe, body, position, location, skillInfo }: PropsJsxPaddle) {
	const { nodes, materials } = useGLTF('./assets/balls&paddles/retroPaddle.glb') as GLTFResultRetroPaddle;

	const refGroup = useRef<THREE.Group>(null);
	const targetColorPower = new THREE.Color("#a7460d");
	const targetColor = new THREE.Color("#422b19");

	useFrame((delta) => {
		if (refGroup.current) {
			refGroup.current.rotation.x = Math.sin(delta.clock.elapsedTime * 3) / 17;
			refGroup.current.position.x = Math.sin(delta.clock.elapsedTime * 3) / 13;
			refGroup.current.position.y = Math.cos(delta.clock.elapsedTime * 3) / 13;

			if ((skillInfo) && ((skillInfo as RetroSkill).power.isActive)) {
				refGroup.current.traverse((child) => {
					if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
						child.material.opacity += ((isMe ? 0.5 : 0) - child.material.opacity) * 0.05;
						child.material.transparent = true;

						child.material.color.lerp(targetColorPower, 0.05);
					}
				});
			} else {
				refGroup.current.traverse((child) => {
					if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
						child.material.opacity += (1 - child.material.opacity) * 0.1;
						child.material.transparent = true;

						child.material.color.lerp(targetColor, 0.1);
					}
				});
			}
		}
		if (body.current)
			body.current.position.set(position.x, position.y, position.z);
	});

	return (
		<>
			<group ref={refGroup} >{/* On modifira que l'opacite pas le visibilite */}
				<group ref={body} rotation={[-Math.PI / 2, -Math.PI / 2 * location, 0]} scale={[0.557, 0.25, 0.15]} dispose={null}>
					<mesh geometry={nodes.Cube330_1.geometry} material={materials['Material.016']} castShadow />
					<mesh geometry={nodes.Cube330_2.geometry} material={materials['Material.017']} castShadow />
					<mesh geometry={nodes.Cube330.geometry} material={materials['Material.018']} castShadow />
					<mesh geometry={nodes.Cube330_3.geometry} material={materials['Material.019']} castShadow />
				</group>
			</group>
		</>
	)
}
