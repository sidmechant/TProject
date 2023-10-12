import { ReactElement, useEffect } from 'react';
import { client, fetchConnectPlayers } from '../../../data/Client';
import { useGame } from '../../../store/hooks/useGame';

export default function Loading(): ReactElement {
	const { send } = useGame();

	useEffect(() => {
		fetchConnectPlayers(send);

		return () => {
			client.socket?.off('connection');
		};
	}, []);

	return <></>;
}