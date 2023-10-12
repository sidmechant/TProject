import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGame } from '../../store/hooks/useGame';

export default function EndAnimation() {
    const { camera } = useThree();
    const { send } = useGame();

    useEffect(() => {
        camera.position.set(-0.92, -17.85, 3.0418428158603854);
        console.log('send end');
        send({ type: 'end' });
        setTimeout(() => {
            console.log('sendEnd');
            send({ type: 'sendEnd' });
        }, 4000);
    }, []);

    return (<></>);
}