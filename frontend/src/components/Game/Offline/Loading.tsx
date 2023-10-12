import { ReactElement, useEffect } from 'react';
import { useGame } from '../../../store/hooks/useGame';
import { MapTheme } from '../../../types/machine';

// TMP - Bouton alleatoire

function getRandomTheme(): MapTheme {
    const themes = Object.values(MapTheme);
    const randomIndex = Math.floor(Math.random() * themes.length);
    return themes[randomIndex];
}

export default function Loading(): ReactElement {
    const { send } = useGame();

    useEffect(() => {
        send({ type: 'updatePlayer', id: 'j1', location: -1 });
        send({ type: 'updatePlayer', id: 'j2', location: 1 });
        send({ type: 'start' });
    }, []);

    return <></>;
}