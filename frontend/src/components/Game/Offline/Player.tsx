import { ReactElement, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Group } from 'three';
import ScoreAnimation from '../../Animation/ScoreAnimation';
import UltiAnimation from '../../Animation/UltiAnimation';
import { useGame } from '../../../store/hooks/useGame';
import { Position } from '../../../store/Player';
import { MapTheme } from '../../../types/machine';
import { Power } from '../../../types/physics';

interface Physic {
	players: {
		position: Position,
		velocity: Position,
		skillInfo?: Power,
		collision: number
	}[]
};

export default function Player(): ReactElement {
	const { state, context, send } = useGame();
	const [physic, setPhysic] = useState<Physic>({
		players: [{
			position: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			collision: 0
		}, {
			position: { x: 0, y: 0, z: 0 },
			velocity: { x: 0, y: 0, z: 0 },
			collision: 0
		}]
	});
	const [index, setIndex] = useState<number>(context.players.findIndex(p => p.id === context.current!.id));
	const player = context.players[0];
	const opponent = context.players[1];
	const bodyPlayer = useRef<Group>(null);
	const bodyOponent = useRef<Group>(null);
	const PaddlePlayer = player.Paddle();
	const PaddleOpponent = opponent.Paddle();
	const [_, getKeys] = useKeyboardControls<string>();
	const [collision, setCollision] = useState<boolean>(false);


	const handleScoreEvent = (index: number): void => {
		setIndex(index);
		send({ type: 'score', index });
	};
	const handleKeyEvent = (context.mode === 'IA')
		? (): void => {
			const { leftward, rightward, ulti } = getKeys();
			if (ulti) {
				setIndex(0);
				send({ type: 'ulti', id: 'j1' });
			}
			context.physic!.setKeys(0, { leftward, rightward });
			context.physic!.setKeys(1, context.physic!.bot);
		} : (): void => {
			const { keyUpward, keyDownward, arrowUpward, arrowDownward, ulti, ulti2 } = getKeys();
			if (ulti) {
				setIndex(0);
				send({ type: 'ulti', id: 'j1' });
			}
			context.physic!.setKeys(0, { leftward: keyUpward, rightward: keyDownward });
			if (ulti2) {
				setIndex(1);
				send({ type: 'ulti', id: 'j2' });
			}
			context.physic!.setKeys(1, { leftward: arrowDownward, rightward: arrowUpward });
		};

	const handleKeyPower = (context.mode === 'IA')
		? (): void => {
			let { power } = getKeys();
			if (!player.power.time) {
				if (player.mapInfo.id === MapTheme.NINJA) {
					if (collision) { power = false; setCollision(false); };
					if (!power && context.physic!.powerIsActive[0]) { send({ type: 'power', id: 'j1' }); }
					context.physic?.setPower(0, power);

				} else {
					context.physic?.setPower(0, power);
					context.physic!.powerIsActive[0] && send({ type: 'power', id: 'j1' });
				}
			}

		} : (): void => {
			const { power, power2 } = getKeys();
			if (!player.power.time) {
				if (player.mapInfo.id === MapTheme.NINJA) {
					if (!power && context.physic!.powerIsActive[0]) { send({ type: 'power', id: 'j1' }); }
					else { context.physic!.setPower(0, power); }

				} else {
					context.physic!.setPower(0, power);
					context.physic!.powerIsActive[0] && send({ type: 'power', id: 'j1' });
				}
			}
			if (!opponent.power.time) {
				if (opponent.mapInfo.id === MapTheme.NINJA) {
					if (!power2 && context.physic!.powerIsActive[1]) { send({ type: 'power', id: 'j2' }); }
					else { context.physic!.setPower(1, power2); }

				} else {
					context.physic!.setPower(1, power2);
					context.physic!.powerIsActive[1] && send({ type: 'power', id: 'j2' });
				}
			}
		};

	useEffect(() => {
		context.physic!.on('score', handleScoreEvent);
		return () => {
			context.physic!.off('score', handleScoreEvent);
		}
	}, []);

	useEffect(() => {
		setCollision(true);
	}, [physic.players[0].collision])

	// useEffect(() => { // TMP
	// 	console.log(player.power.time)
	// }, [player.power.time]);

	useEffect(() => { // TMP
		console.log(player.score, opponent.score)
	}, [player.score, opponent.score])

	useFrame(() => {
		send({ type: 'update' });
		state === 'Play' && handleKeyEvent();
		state === 'Play' && handleKeyPower();
		setPhysic({
			players: [{
				position: context.physic!.playersPosition[0],
				velocity: context.physic!.playersVelocity[0],
				skillInfo: context.physic!.skillInfo[0],
				collision: context.physic!.collisions.paddle[0]
			}, {
				position: context.physic!.playersPosition[1],
				velocity: context.physic!.playersVelocity[1],
				skillInfo: context.physic!.skillInfo[1],
				collision: context.physic!.collisions.paddle[1]
			}]
		})
	});


	return <>
		{context.animation === 'Score' && <ScoreAnimation index={index} />}
		{context.animation === 'Ulti' && <UltiAnimation index={index} />}
		<PaddlePlayer
			isMe={true}
			body={bodyPlayer}
			position={physic.players[0].position}
			velocity={physic.players[0].velocity}
			location={player.location!}
			skillInfo={physic.players[0].skillInfo}
			collision={physic.players[0].collision} />
		<PaddleOpponent
			isMe={false}
			body={bodyOponent}
			position={physic.players[1].position}
			velocity={physic.players[1].velocity}
			location={opponent.location!}
			skillInfo={physic.players[1].skillInfo}
			collision={physic.players[1].collision} />
	</>;
}