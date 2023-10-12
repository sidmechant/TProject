import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../store/hooks/useGame';
import { client } from '../../data/Client';

const PlayButton = styled.button`
	position: relatif;
	background-color: green;
	border-radius: 12px;
	width: 192px;
	height: 72px;
	left: 154px;
	bottom: 10px;
    z-index: 1;
`;

export default function End(): ReactElement {
    const { context, send } = useGame();
    const [disableRestart, setDisableRestart] = useState<boolean>(false);

    if (!['2PLocal', 'IA'].includes(context.mode!)) {
        useEffect(() => {
            const timer = setTimeout(() => {
                setDisableRestart(true);
            }, 15000);
            return () => clearTimeout(timer);
        }, []);
    }

    return <>
        <PlayButton onClick={() => {
            !['2PLocal', 'IA'].includes(context.mode!) && client.socket?.emit('leave');
            send({ type: 'leave' });
        }}>
            Leave
        </PlayButton>
        {
            (!disableRestart)
                ? <PlayButton onClick={() => {
                    !['2PLocal', 'IA'].includes(context.mode!) && client.socket?.emit('restart');
                    send({ type: 'restart' });
                }}>
                    Restart
                </PlayButton>
                : <PlayButton >
                    Tu peux plus restart batard
                </PlayButton>
        }
    </>;
}