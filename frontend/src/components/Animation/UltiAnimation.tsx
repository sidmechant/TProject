import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useGame } from "../../store/hooks/useGame";
import { client } from "../../data/Client";
import { Player } from "../../store/Player";
import { MapTheme } from "../../types/machine";

export default function UltiAnimation({ index }: { index: number }) {
    const { camera } = useThree();
    const { context, send } = useGame();
    const player: Player = context.players[index];

    useEffect(() => {
        camera.position.set(-0.92, -17.85, 3.0418428158603854);
        if (context.mode !== '2PLocal') {
            setTimeout(() => {
                console.log('send ulti');
                send({ type: 'ulti', id: player.id });
            }, 1000);
        }
        setTimeout(() => {
            if (['MatchMaking', '2POnline'].includes(context.mode!)) {
                client.socket?.on('play', () => {
                    send({ type: 'start' });
                    console.log('Server: event: play');
                });
                client.socket?.emit('play');
                console.log('Server: emit: play');
            } else {
                send({ type: 'start' });
            }
        }, 4000);
        
        return () => {
            client.socket?.off('play');
        };
    }, []);

    // const lerp = (start: number, end: number, alpha: number): number => {
    //     return (1 - alpha) * start + alpha * end;
    // };
    
    // useFrame((_, delta) => {
    //     const player = context.players.find(p => p.mapInfo.id === MapTheme.RETRO);
    //     const targetFar = (player && player.ulti) ? 8.2: 50;
    
    //     // Utilisation de lerp pour faire une transition fluide
    //     const alpha = delta;  // Ajustez cette valeur pour contrôler la vitesse de la transition
    //     camera.far = lerp(camera.far, targetFar, alpha);
    //     // camera.far = 10;
    //     console.log(camera.far);
    
    //     camera.updateProjectionMatrix(); // Mettre à jour la matrice de projection
    // });


    return (<></>);
}