"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGameAction = exports.ultiGameAction = exports.startGameAction = exports.restartGameAction = exports.readyGameAction = exports.scoreGameAction = exports.powerGameAction = exports.leaveGameAction = exports.joinGameAction = exports.chooseMapAction = void 0;
const machine_1 = require("../types/machine");
const chooseMapAction = (context, event) => {
    return { players: context.players.map(p => p.id === event.id ? { ...p, map: event.map } : p) };
};
exports.chooseMapAction = chooseMapAction;
const joinGameAction = (context, event) => {
    return {
        players: [...context.players, {
                id: event.id,
                name: event.name,
                score: 0,
                ready: false,
                ulti: false,
                canUseUlti: true,
                power: {
                    start: 0,
                    time: 0,
                    cooldown: 0
                }
            }]
    };
};
exports.joinGameAction = joinGameAction;
const leaveGameAction = (context, event) => {
    return { players: context.players.filter(p => p.id !== event.id) };
};
exports.leaveGameAction = leaveGameAction;
const powerGameAction = (context, event) => {
    return {
        players: context.players.map(p => {
            if (p.id === event.id) {
                p.power.start = Date.now();
                p.power.cooldown = (p.map === machine_1.MapTheme.MEDIEVAL) ? 8000 :
                    (p.map === machine_1.MapTheme.WESTERN) ? 4000 :
                        (p.map === machine_1.MapTheme.NINJA) ? 12000 :
                            (p.map === machine_1.MapTheme.RETRO) ? 10000 : 0;
            }
            return p;
        })
    };
};
exports.powerGameAction = powerGameAction;
const scoreGameAction = (context, event) => {
    return {
        players: context.players.map((p, i) => {
            if (i === event.index) {
                p.score += 1;
            }
            p.power = { ...p.power, start: 0, time: 0 };
            p.ulti = false;
            return p;
        })
    };
};
exports.scoreGameAction = scoreGameAction;
const readyGameAction = (context, event) => {
    return { players: context.players.map(p => p.id === event.id ? { ...p, ready: true } : p) };
};
exports.readyGameAction = readyGameAction;
const restartGameAction = (context, _) => {
    return { players: context.players.map(p => ({ ...p, map: undefined, score: 0, ready: false, ulti: false, canUseUlti: true })) };
};
exports.restartGameAction = restartGameAction;
const startGameAction = (context, _) => {
    return { players: context.players.map(p => ({ ...p, ready: false })) };
};
exports.startGameAction = startGameAction;
const ultiGameAction = (context, event) => {
    return { players: context.players.map(p => p.id === event.id ? { ...p, ulti: true, canUseUlti: false } : p) };
};
exports.ultiGameAction = ultiGameAction;
const updateGameAction = (context, _) => {
    return {
        players: context.players.map((p) => {
            if (p.power.start) {
                const time = Date.now() - p.power.start;
                if (time >= p.power.cooldown) {
                    p.power.start = 0;
                    p.power.time = 0;
                }
                else {
                    p.power.time = p.power.cooldown - time;
                }
            }
            return p;
        })
    };
};
exports.updateGameAction = updateGameAction;
//# sourceMappingURL=actions.js.map