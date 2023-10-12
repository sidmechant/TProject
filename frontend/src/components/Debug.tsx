import { AxesHelper } from 'three';
import { useThree } from '@react-three/fiber';
import { ReactElement } from 'react';
import { OrbitControls } from '@react-three/drei';

type DebugProps = {
	axes?: boolean,
	controls?: boolean
}

function Axes({ visible }: { visible: boolean }): null {
	const { scene } = useThree();
	const axesHelper = new AxesHelper(5);

	axesHelper.visible = visible;
	scene.add(axesHelper);
	return null;
}

function Controls({ enabled }: { enabled: boolean }): ReactElement | null {
	if (enabled)
		return (
			<>
				<OrbitControls />
			</>
		)
	return null;
}

export default function Debug({ axes = true, controls = true }: DebugProps) {
	return <>
		<Axes visible={axes} />
		<Controls enabled={controls} />
	</>;
}