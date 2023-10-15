import { GameGuard } from "../types/machine";
export declare const canJoinGuard: GameGuard<'join'>;
export declare const canChooseMap: GameGuard<'chooseMap'>;
export declare const canLeaveGuard: GameGuard<'leave'>;
export declare const canStartGuard: GameGuard<'start'>;
export declare const canUseUltiGuard: GameGuard<'ulti'>;
export declare const isReadyGuard: GameGuard<'start'>;
export declare const isEndGameGuard: GameGuard<'start'>;
