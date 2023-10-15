import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Player as PlayerMachine } from './types/machine';
import { Player as PlayerPhisic } from './types/physics';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly crudService;
    constructor(crudService: CrudService);
    server: Server;
    getUserIdByToken(token: string): {
        userId: string;
    };
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleEventBall(client: Socket): void;
    handleEventChooseMap(client: Socket, data: {
        map: PlayerMachine['map'];
    }): void;
    handleEventConnect(client: Socket): void;
    handleEventJoin(client: Socket, data: {
        name: PlayerMachine['name'];
    }): void;
    handleEventLeave(client: Socket): void;
    handleEventMove(client: Socket, data: {
        key: PlayerPhisic['key'] & {
            ulti: boolean;
            power: boolean;
        };
    }): void;
    handleEventPlayers(client: Socket): void;
    handleEventRestart(client: Socket): void;
    handleEventStart(client: Socket): void;
    handleEventPlay(client: Socket): void;
    handleEventSkillInfo(client: Socket): void;
}
