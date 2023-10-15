import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewaySessionManager } from './chat.session';
import { Friend } from '@prisma/client';
import { ChannelSocketDto, MessageSocketDto } from 'src/dto/chat.dto';
import { MessageService } from 'src/message/message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    readonly sessionManager: GatewaySessionManager;
    private readonly eventEmitter;
    private readonly messageService;
    private readonly logger;
    server: Server;
    constructor(sessionManager: GatewaySessionManager, eventEmitter: EventEmitter2, messageService: MessageService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinChannel(channel: string, client: Socket): void;
    handleMessage(message: string): void;
    emitFriendRequestCreate(payload: Friend): void;
    emitFriendRequestCancel(payload: Friend): void;
    emitFriendRequestAccepted(payload: Friend): void;
    emitFriendRequestRejected(payload: Friend): void;
    onChannelJoin(data: ChannelSocketDto, client: Socket): void;
    onChannelLeave(data: ChannelSocketDto, client: Socket): void;
    handleChannelCreate(payload: ChannelSocketDto): void;
    handletest(payload: any): void;
    handleMessageSend(channelName: any, message: string): void;
    handleMessageCreateEvent(payload: MessageSocketDto): void;
    handleMessageDelete(payload: MessageSocketDto): Promise<void>;
    handleMessageUpdate(message: MessageSocketDto): Promise<void>;
}
