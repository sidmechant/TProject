import { GameGuard } from "../types/machine";

export const canJoinGuard: GameGuard<'join'> = (context, event) => {
    return context.players.length < 2 && !context.players.find(p => p.id === event.id);
}

export const canChooseMap: GameGuard<'chooseMap'> = (context, event) => {
    return !!context.players.find(p => p.id === event.id);
}

export const canLeaveGuard: GameGuard<'leave'> = (context, event) => {
    return !!context.players.find(p => p.id === event.id);
}

export const canStartGuard: GameGuard<'start'> = (context, _) => {
    return context.players.length == 2 && context.players.every(p => p.map);
}

export const canUseUltiGuard: GameGuard<'ulti'> = (context, event) => {
    return context.players.find(p => p.id === event.id)!.canUseUlti;
}

export const isReadyGuard: GameGuard<'start'> = (context, _) => {
    return context.players.length == 2 && context.players.every(p => p.ready === true);
}


export const isEndGameGuard: GameGuard<'start'> = (context, event) => {
    return !!context.players.find(p => p.score === context.victory);
}
