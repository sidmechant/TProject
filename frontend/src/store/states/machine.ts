import { AnimationStates, GameStates, MapTheme, ModeType } from "../../types/machine";
import { createModel } from "xstate/lib/model";
import { canChangeCurrentGuard, canJoinGuard, canStartGuard, canUseUltiGuard, isEndGameGuard } from "./guards";
import { changeCurrentAction, changeStarsColorAction, chooseMapAction, chooseModeAction, joinGameAction, leaveGameAction, restartGameAction, scoreGameAction, startPhysicAction, updatePlayerGameAction, introGameAction, startGameAction, setIsMapVisibleAction, ultiGameAction, powerGameAction, updateGameAction } from "./actions";
import { Physic } from "../physic/Physic";
import { Player } from "../Player";
import React from "react";
import { Group } from "three";

export const GameModel = createModel({
	animation: undefined as AnimationStates | undefined,
	starsColor: ['#2245e2', '#d92fe6', '#f0e51c', '#1cf030', '#ffffff'] as string[],
	starsRef: null as React.MutableRefObject<Group | null> | null,
	mode: undefined as ModeType | undefined,
	current: undefined as Player | undefined,
	players: [] as Player[],
	physic: null as Physic | null,
	isMapVisible: true as boolean,
	victory: 874877,
}, {
	events: {
		changeCurrent: (id: Player['id']) => ({ id }),
		changeStarsColor: () => ({}),
		chooseMap: (map: MapTheme) => ({ map }),
		chooseMode: (mode: ModeType) => ({ mode }),
		intro: () => ({}),
		join: (id: Player['id'], name: Player['name']) => ({ id, name }),
		leave: () => ({}),
		end: () => ({}),
		load: () => ({}),
		power: (id: Player['id']) => ({ id }),
		restart: () => ({}),
		score: (index: number) => ({ index }),
		sendEnd: () => ({}),
		setIsMapVisible: () => ({}),
		setStarsRef: (starsRef: React.MutableRefObject<Group | null>) => ({ starsRef }),
		start: () => ({}),
		ulti: (id: Player['id']) => ({ id }),
		updatePlayer: (id: Player['id'], location: Player['location']) => ({ id, location }),
		update: () => ({})
	}
});


export const GameMachine = GameModel.createMachine({
	id: 'game',
	predictableActionArguments: true,
	context: GameModel.initialContext,
	initial: GameStates.MODE,
	states: {
		[GameStates.MODE]: {
			entry: [GameModel.assign(changeStarsColorAction)],
			on: {
				chooseMode: {
					actions: [GameModel.assign(chooseModeAction)],
					target: GameStates.MAP
				},
				join: {
					cond: canJoinGuard,
					actions: [GameModel.assign(joinGameAction)],
					target: GameStates.MODE
				},
				leave: {
					actions: [GameModel.assign(leaveGameAction)],
					target: GameStates.MODE
				},
				setStarsRef: {
					actions: [GameModel.assign({ starsRef: (_, event) => event.starsRef })],
					target: GameStates.MODE
				},
			}
		},
		[GameStates.MAP]: {
			entry: [GameModel.assign(changeStarsColorAction)],
			on: {
				changeCurrent: {
					cond: canChangeCurrentGuard,
					actions: [GameModel.assign(changeCurrentAction)],
					target: GameStates.MAP
				},
				chooseMap: {
					actions: [GameModel.assign(chooseMapAction)],
					target: GameStates.MAP
				},
				load: {
					target: GameStates.LOADING
				},
				leave: {
					actions: [GameModel.assign(leaveGameAction)],
					target: GameStates.MODE
				}
			}
		},
		[GameStates.LOADING]: {
			on: {
				changeCurrent: {
					cond: canChangeCurrentGuard,
					actions: [GameModel.assign(changeCurrentAction)],
					target: GameStates.LOADING
				},
				chooseMap: {
					actions: [GameModel.assign(chooseMapAction)],
					target: GameStates.LOADING
				},
				join: {
					cond: canJoinGuard,
					actions: [GameModel.assign(joinGameAction)],
					target: GameStates.LOADING
				},
				start: {
					cond: canStartGuard,
					actions: [GameModel.assign(startGameAction)],
					target: GameStates.ANIMATION
				},
				updatePlayer: {
					actions: [GameModel.assign(updatePlayerGameAction)],
					target: GameStates.LOADING
				}
			}
		},
		[GameStates.PLAY]: {
			on: {
				changeCurrent: {
					cond: canChangeCurrentGuard,
					actions: [GameModel.assign(changeCurrentAction)],
					target: GameStates.PLAY
				},
				end: {
					actions: [GameModel.assign({ animation: AnimationStates.END })],
					target: GameStates.ANIMATION
				},
				leave: {
					actions: [GameModel.assign(leaveGameAction)],
					target: GameStates.MODE
				},
				score: {
					actions: [GameModel.assign(scoreGameAction)],
					target: GameStates.ANIMATION
				},
				power: {
					actions: [GameModel.assign(powerGameAction)],
					target: GameStates.PLAY
				},
				ulti: {
					cond: canUseUltiGuard,
					actions: [GameModel.assign(ultiGameAction)],
					target: GameStates.ANIMATION
				},
				update: {
					actions: [GameModel.assign(updateGameAction)],
					target: GameStates.PLAY
				}
			}
		},
		[GameStates.END]: {
			entry: [GameModel.assign(setIsMapVisibleAction)],
			on: {
				restart: {
					actions: [GameModel.assign(restartGameAction)],
					target: GameStates.MAP
				},
				leave: {
					actions: [GameModel.assign(leaveGameAction)],
					target: GameStates.MODE
				}
			}
		},
		[GameStates.ANIMATION]: {
			on: {
				changeCurrent: {
					cond: canChangeCurrentGuard,
					actions: [GameModel.assign(changeCurrentAction)],
					target: GameStates.ANIMATION
				},
				end: {
					// Animation de end
					actions: [GameModel.assign({ animation: AnimationStates.END })],
					target: GameStates.ANIMATION
				},
				intro: {
					actions: [GameModel.assign(introGameAction)],
					target: GameStates.ANIMATION
				},
				leave: {
					actions: [GameModel.assign(leaveGameAction)],
					target: GameStates.MODE
				},
				score: {
					// Animation de score
					target: GameStates.ANIMATION
				},
				sendEnd: {
					actions: [GameModel.assign({ animation: undefined })],
					target: GameStates.END
				},
				start: [{
					cond: isEndGameGuard,
					actions: [GameModel.assign({ animation: AnimationStates.END })],
					target: GameStates.ANIMATION
				}, {
					actions: [GameModel.assign(startPhysicAction)],
					target: GameStates.PLAY
				}],
				ulti: {
					// Animation d'ulti
					target: GameStates.ANIMATION
				}
			}
		}

	}

});