import { ReactElement } from 'react';
import End from './End';
import Lobby from '../Lobby/Lobby';
import { useGame } from '../../store/hooks/useGame';

export default function Interface(): ReactElement {
    const { state } = useGame();
    return <>
        {(['Mode', 'Map'].includes(state)) && <Lobby />}
        {(['End'].includes(state)) && <End />}
    </>;
}