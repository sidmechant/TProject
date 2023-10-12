import { Suspense } from 'react';
import Loading from './Loading';
import World from './World';
import { useGame } from '../../../store/hooks/useGame';

export default function Online() {
	const { state } = useGame();

	return (state === 'Loading')
		? <Loading />
		: <Suspense><World /></Suspense>;
}