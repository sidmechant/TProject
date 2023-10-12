import { ReactElement, useEffect } from 'react';
import { RootState, useThree } from '@react-three/fiber';
import { useGame } from '../../store/hooks/useGame';

export default function EndExperience(): ReactElement {
    const { camera } = useThree<RootState>();
    const { context } = useGame();

    useEffect(() => {
        if (context.mode === '2PLocal') {
            camera.position.x = 0;
            camera.position.y = -2;
            camera.position.z = 10;
        } else {
            camera.position.x = -8.7 * (context.players[0].location as -1 | 1);
            camera.position.y = 0;
            camera.position.z = 1.6;
        }
    }, []);

    return <></>;
}