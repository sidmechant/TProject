"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMachine = exports.GameModel = void 0;
const machine_1 = require("../types/machine");
const model_1 = require("xstate/lib/model");
const guards_1 = require("./guards");
const actions_1 = require("./actions");
exports.GameModel = (0, model_1.createModel)({
    players: [],
    victory: 5
}, {
    events: {
        join: (id, name) => ({ id, name }),
        chooseMap: (id, map) => ({ id, map }),
        leave: (id) => ({ id }),
        power: (id) => ({ id }),
        ready: (id) => ({ id }),
        restart: () => ({}),
        start: () => ({}),
        score: (index) => ({ index }),
        ulti: (id) => ({ id }),
        update: () => ({})
    }
});
exports.GameMachine = exports.GameModel.createMachine({
    id: 'game',
    predictableActionArguments: true,
    context: exports.GameModel.initialContext,
    initial: machine_1.GameStates.MAP,
    states: {
        [machine_1.GameStates.MAP]: {
            on: {
                join: {
                    cond: guards_1.canJoinGuard,
                    actions: [exports.GameModel.assign(actions_1.joinGameAction)],
                    target: machine_1.GameStates.MAP
                },
                chooseMap: {
                    cond: guards_1.canChooseMap,
                    actions: [exports.GameModel.assign(actions_1.chooseMapAction)],
                    target: machine_1.GameStates.MAP
                },
                start: {
                    cond: guards_1.canStartGuard,
                    target: machine_1.GameStates.ANIMATION
                },
                leave: {
                    cond: guards_1.canLeaveGuard,
                    actions: [exports.GameModel.assign(actions_1.leaveGameAction)],
                    target: machine_1.GameStates.MAP
                }
            }
        },
        [machine_1.GameStates.PLAY]: {
            on: {
                score: {
                    actions: [exports.GameModel.assign(actions_1.scoreGameAction)],
                    target: machine_1.GameStates.ANIMATION
                },
                power: {
                    actions: [exports.GameModel.assign(actions_1.powerGameAction)],
                    target: machine_1.GameStates.PLAY
                },
                leave: {
                    cond: guards_1.canLeaveGuard,
                    actions: [exports.GameModel.assign(actions_1.leaveGameAction), 'sendEnd'],
                    target: machine_1.GameStates.END
                },
                ulti: {
                    cond: guards_1.canUseUltiGuard,
                    actions: [exports.GameModel.assign(actions_1.ultiGameAction)],
                    target: machine_1.GameStates.ANIMATION
                },
                update: {
                    actions: [exports.GameModel.assign(actions_1.updateGameAction)],
                    target: machine_1.GameStates.PLAY
                }
            }
        },
        [machine_1.GameStates.END]: {
            entry: 'sendEnd',
            on: {
                restart: {
                    actions: [exports.GameModel.assign(actions_1.restartGameAction)],
                    target: machine_1.GameStates.MAP
                },
                leave: {
                    cond: guards_1.canLeaveGuard,
                    actions: [exports.GameModel.assign(actions_1.leaveGameAction)],
                    target: machine_1.GameStates.MAP
                }
            }
        },
        [machine_1.GameStates.ANIMATION]: {
            on: {
                ready: {
                    actions: [exports.GameModel.assign(actions_1.readyGameAction)],
                    target: machine_1.GameStates.ANIMATION
                },
                start: [{
                        cond: guards_1.isEndGameGuard,
                        target: machine_1.GameStates.END
                    }, {
                        cond: guards_1.isReadyGuard,
                        actions: [exports.GameModel.assign(actions_1.startGameAction)],
                        target: machine_1.GameStates.PLAY
                    }],
                leave: {
                    actions: [exports.GameModel.assign(actions_1.leaveGameAction), 'sendEnd'],
                    target: machine_1.GameStates.END
                }
            }
        }
    }
});
//# sourceMappingURL=machine.js.map