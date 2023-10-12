import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber'
import { client, fetchStartPlayers } from '../../data/Client';
import { useGame } from '../../store/hooks/useGame';
import { BoxGeometry, MeshStandardMaterial } from 'three';
import { useControls } from 'leva';
import gsap from 'gsap';

// if (context.mode === '2PLocal') {
//     camera.position.x = 0;
//     camera.position.y = -2;
//     camera.position.z = 10;
// } else {
//     camera.position.x = 8.7 * context.players[0].location;
//     camera.position.y = 0;
//     camera.position.z = 1.6;
// }
// }
// camera.lookAt(new Vector3(0, 0, 0));

export default function IntroAnimation() {

	const { camera } = useThree();
	const { context, send } = useGame();
	const player = context.players[0];
	const opponent = context.players[1];
	const MapPlayer = player.Map();
	const MapOpponent = opponent.Map();

	const { myButton } = useControls({ myButton: { value: false, button: true } });
	//separator final pos=> x: 0, y: 0, z: -1.4
	//opponent final pos=> x: 0, y: 0, z: 0
	//player final pos=> x: 0, y: 0, z: 0

	//plan 1 => x: 0, y: 0, z: 17
	//plan 2 => x: 0, y: 17, z: 4

	useEffect(() => {
		if (myButton) {

			console.log("position player: ", refPlayer.current?.position);
			console.log("position opponent: ", refOpponent.current?.position);
			console.log("position separator: ", refSepartor.current?.position);
			console.log("position camera: ", camera.position);
		}
	}, [myButton]);
	const { x, y, z } = useControls('Camera', {
		x: { value: 0, min: -10, max: 100 },
		y: { value: 0, min: -10, max: 100 },
		z: { value: 0, min: -10, max: 100 },
	});

	const { rotationX, rotationY, rotationZ } = useControls('Camera', {
		rotationX: { value: 0, min: -Math.PI, max: Math.PI },
		rotationY: { value: 0, min: -Math.PI, max: Math.PI },
		rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
	});

	useEffect(() => {
		camera.position.x = x;
		camera.position.y = y;
		camera.position.z = z;
		camera.rotation.x = rotationX;
		camera.rotation.y = rotationY;
		camera.rotation.z = rotationZ;
	}
		, [x, y, z, rotationX, rotationY, rotationZ]);

	const refOpponent = useRef<THREE.Group>(null);
	const refPlayer = useRef<THREE.Group>(null);
	const refSepartor = useRef<THREE.Mesh>(null);

	useFrame((delta) => {
		const radius = 1;
		const time = delta.clock.elapsedTime;

		if (context.starsRef) {
			context.starsRef.current?.position.set(3,0,0);
			context.starsRef.current?.scale.set(Math.cos(time), 1, 1);
			// context.starsRef.current?.position.set(Math.sin(time / 10) * 10, Math.cos(time / 10) * 10, Math.cos(time / 10) * 10);
			// context.starsRef.current?.rotation.set(time / 10, time / 10, time / 10);
		}
		// camera.position.x = radius * Math.cos(time / 2);
		// camera.position.y = radius * Math.sin(time / 2);
	});

	useEffect(() => {
		refPlayer.current?.position.set(-40, 0, 0.5);
		refOpponent.current?.position.set(40, 0, -0.5);
		refSepartor.current?.position.set(0, 0, 40);
		gsap.to(camera.position, { x: 0, y: 0, z: 17, duration: 2 });
		gsap.to(camera.position, { x: 0, y: -17, z: 4, duration: 2, delay: 2 });
		if (refPlayer.current && refOpponent.current && refSepartor.current) {
			gsap.to(refPlayer.current.position, { x: 0, y: 0, z: 0.5, duration: 4, delay: 0, ease: "circ.out" });
			gsap.to(refOpponent.current.position, { x: 0, y: 0, z: -0.5, duration: 4, delay: 0, ease: "circ.out" });
			gsap.to(refSepartor.current.position, { x: 0, y: 0, z: -1.4, duration: 4.4, delay: 0 });

			gsap.to(refPlayer.current.position, { x: 0, y: 0, z: 0, duration: 0.4, delay: 4.2, ease: "power4.in" });
			gsap.to(refOpponent.current.position, { x: 0, y: 0, z: 0, duration: 0.4, delay: 4.2, ease: "power4.in" });
			// gsap.to(camera.position, { x: -17, y: 0, z: 0, duration: 2.5, delay: 4.2 });
			// gsap.to(camera.position, { x: 0, y: 17, z: 0, duration: 2.5, delay: 6.7 });
		}
		// gsap.to(camera.rotation, { x: 0, y: Math.PI / 2, z: 0, duration: 2.5, delay: 4.2 });
		// gsap.to(camera.position, { x: 0, y: 17, z: 0, duration: 2.5, delay: 4.2, ease: "power4.in" });
		// if (refPlayer.current) {
		// 	refPlayer.current.position.set(
		// 		refPlayer.current.position.x + 100,
		// 		refPlayer.current.position.y + 100,
		// 		refPlayer.current.position.z + 0.5);
		// }
		// if (refOpponent.current) {
		// 	refOpponent.current.position.set(
		// 		refOpponent.current.position.x + 100,
		// 		refOpponent.current.position.y + 100,
		// 		refOpponent.current.position.z + 0.5);
		// }
		// if (refSepartor.current) {
		// 	refSepartor.current.position.set(
		// 		refSepartor.current.position.x + 100,
		// 		refSepartor.current.position.y + 100,
		// 		refSepartor.current.position.z + 0.5);
		// }
		// camera.position.set(
		// 	-0.92 + 100,
		// 	-17.85 + 100,
		// 	3.0418428158603854 + 0.5);
		// camera.lookAt(refSepartor.current?.position!);
		// camera.position.set(-0.92, -17.85, 3.0418428158603854);
		if (context.mode !== '2PLocal') {
			setTimeout(() => {
				console.log('send intro');
				send({ type: 'intro' });
			}, 3000);
		}
		setTimeout(() => {
			if (['MatchMaking', '2POnline'].includes(context.mode!)) {
				fetchStartPlayers(context, send);
			} else {
				send({ type: 'start' });
			}
		}, 7000);

		return () => {
			client.socket?.off('start');
		};
	}, []);

	return <>
		<group ref={refPlayer}>
			<MapPlayer
				index={0}
				visible={context.isMapVisible} />
		</group>
		<mesh
			ref={refSepartor}
			position={[0, 0, -1.4]}
			geometry={new BoxGeometry(0.2, 4.6, 2.1)}
			material={new MeshStandardMaterial({ color: 'mediumpurple' })} />
		<group ref={refOpponent}>
			<MapOpponent index={1} />
		</group>

	</>;
}