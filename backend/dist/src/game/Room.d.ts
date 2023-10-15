import { GameContext, GameStates } from './types/machine';
import { Player as PlayerMachine } from './types/machine';
import { Player as PlayerPhysic } from './types/physics';
import { Socket } from 'socket.io';
export declare class Room {
    private machine;
    private physic;
    private clients;
    private state;
    private reconnection;
    constructor(state?: GameStates, context?: Partial<GameContext>);
    ball(client: Socket): void;
    chooseMap(client: Socket, map: PlayerMachine['map']): void;
    counter(counter: number): void;
    join(client: Socket, name?: PlayerMachine['name']): boolean;
    leave(client: Socket): boolean;
    move(client: Socket, key: PlayerPhysic['key'] & {
        ulti: boolean;
        power: boolean;
    }): void;
    play(client: Socket): void;
    player(client: Socket): void;
    skillInfo(client: Socket): void;
    restart(): void;
    score(index: number): void;
    sendEnd(): void;
    sendLeave(): void;
    connect(): void;
    start(client: Socket): void;
    stop(): void;
    get isFull(): boolean;
    get isEmpty(): boolean;
    get players(): {
        client: Socket;
        name: PlayerMachine['name'];
        map: PlayerMachine['map'];
    }[];
}
