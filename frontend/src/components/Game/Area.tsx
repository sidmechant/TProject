import { ReactElement, useEffect, useState } from 'react';
import { BoxGeometry, MeshStandardMaterial} from 'three';
import { useGame } from '../../store/hooks/useGame';
import { Bloom, EffectComposer, FXAA } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import { Power } from '../../types/physics';
import { client } from '../../data/Client';

interface Physic {
	players: {
		skillInfo?: Power
	}[]
};

export default function Area(): ReactElement {
	const { context } = useGame();
	const player = context.players[0];
	const opponent = context.players[1];
	const MapPlayer = player.Map();
	const MapOpponent = opponent.Map();
	const [physic, setPhysic] = useState<Physic>({
		players: [{}, {}]
	});

	useEffect(() => {
		client.socket?.on('skillInfo', (players: Physic) => {
			setPhysic(players);
			console.log(players.players[0].skillInfo)
			console.log(players.players[1].skillInfo)
		});

		return () => {
			client.socket?.off('skillInfo')
		}
	}, []);

	useFrame(() => {
		if (['2PLocal', 'IA'].includes(context.mode!)) {
			setPhysic({
				players: [{
					skillInfo: context.physic!.skillInfo[0]
				}, {
					skillInfo: context.physic!.skillInfo[1]
				}]
			});
		} else {
			client.socket?.emit('skillInfo');
		}
	});

	return <>
		{/* <Box args={[0.2, 1, 0.25]} position={new Vector3(-5.5, MAP_HEIGHT * 0.25 * 0 - MAP_HEIGHT * 0.375, 0)} />
		<Box args={[0.2, 1, 0.25]} position={new Vector3(-5.5, MAP_HEIGHT * 0.25 * 1 - MAP_HEIGHT * 0.375, 0)} />
		<Box args={[0.2, 1, 0.25]} position={new Vector3(-5.5, MAP_HEIGHT * 0.25 * 2 - MAP_HEIGHT * 0.375, 0)} />
		<Box args={[0.2, 1, 0.25]} position={new Vector3(-5.5, MAP_HEIGHT * 0.25 * 3 - MAP_HEIGHT * 0.375, 0)} /> */}
		<MapPlayer
			index={0}
			visible={context.isMapVisible}
			skillInfo={physic.players[0].skillInfo} />
		<mesh
			position={[0, 0, -1.4]}
			geometry={new BoxGeometry(0.2, 4.6, 2.1)}
			material={new MeshStandardMaterial({ color: 'mediumpurple' })} />
		<MapOpponent index={1} skillInfo={physic.players[1].skillInfo} />
		<EffectComposer multisampling={0}>
			<FXAA />
			<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={0} />
		</EffectComposer>
	</>;
}
