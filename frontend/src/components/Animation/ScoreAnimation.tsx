import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { client, fetchStartPlayers } from '../../data/Client';
import { useGame } from '../../store/hooks/useGame';
import { Player } from '../../store/Player';

export default function ScoreAnimation({ index }: { index: number }) {
    const { camera } = useThree();
    const { context, send } = useGame();
    const winner: Player = context.players[index];

    useEffect(() => {
        camera.position.set(-0.92, -17.85, 3.0418428158603854);
        if (context.mode !== '2PLocal') {
            setTimeout(() => {
                console.log('send score');
                send({ type: 'score', index });
            }, 1000);
        }
        setTimeout(() => {
            if (['MatchMaking', '2POnline'].includes(context.mode!)) {
                fetchStartPlayers(context, send);
            } else {
                send({ type: 'start' });
            }
        }, 4000);
        ;

        return () => {
            client.socket?.off('start');
        };
    }, []);

    return (<></>);
}
