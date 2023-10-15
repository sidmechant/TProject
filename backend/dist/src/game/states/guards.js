"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEndGameGuard = exports.isReadyGuard = exports.canUseUltiGuard = exports.canStartGuard = exports.canLeaveGuard = exports.canChooseMap = exports.canJoinGuard = void 0;
const canJoinGuard = (context, event) => {
    return context.players.length < 2 && !context.players.find(p => p.id === event.id);
};
exports.canJoinGuard = canJoinGuard;
const canChooseMap = (context, event) => {
    return !!context.players.find(p => p.id === event.id);
};
exports.canChooseMap = canChooseMap;
const canLeaveGuard = (context, event) => {
    return !!context.players.find(p => p.id === event.id);
};
exports.canLeaveGuard = canLeaveGuard;
const canStartGuard = (context, _) => {
    return context.players.length == 2 && context.players.every(p => p.map);
};
exports.canStartGuard = canStartGuard;
const canUseUltiGuard = (context, event) => {
    return context.players.find(p => p.id === event.id).canUseUlti;
};
exports.canUseUltiGuard = canUseUltiGuard;
const isReadyGuard = (context, _) => {
    return context.players.length == 2 && context.players.every(p => p.ready === true);
};
exports.isReadyGuard = isReadyGuard;
const isEndGameGuard = (context, event) => {
    return !!context.players.find(p => p.score === context.victory);
};
exports.isEndGameGuard = isEndGameGuard;
//# sourceMappingURL=guards.js.map