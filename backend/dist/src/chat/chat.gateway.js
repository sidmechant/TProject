"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_session_1 = require("./chat.session");
const event_emitter_1 = require("@nestjs/event-emitter");
const chat_dto_1 = require("../dto/chat.dto");
const message_service_1 = require("../message/message.service");
const event_emitter_2 = require("@nestjs/event-emitter");
let ChatGateway = class ChatGateway {
    constructor(sessionManager, eventEmitter, messageService) {
        this.sessionManager = sessionManager;
        this.eventEmitter = eventEmitter;
        this.messageService = messageService;
        this.logger = new common_1.Logger('ChatGatway');
    }
    async handleConnection(client) {
        console.log("QUERY = ", client.handshake.query);
        const token = client.handshake.query.jwt_token;
        console.log('Client connected CHAT:', token);
        this.sessionManager.setUserSocket(token, client);
    }
    async handleDisconnect(client) {
        const token = client.handshake.query.token;
        console.log('Client disconnected CHAT:', token);
        this.sessionManager.removeUserSocket(token);
    }
    handleJoinChannel(channel, client) {
        client.join(channel);
    }
    handleMessage(message) {
        const formattedMessage = `Nouveau message : ${message}`;
        console.log(message);
        this.server.emit('message', formattedMessage);
    }
    emitFriendRequestCreate(payload) {
        const receiverSocket = this.sessionManager.getUserSocket(payload.friendId);
        receiverSocket && receiverSocket.emit('onFriendRequestReceived', payload);
    }
    emitFriendRequestCancel(payload) {
        const receiverSocket = this.sessionManager.getUserSocket(payload.friendId);
        receiverSocket && receiverSocket.emit('onFriendRequestCancelled', payload);
    }
    emitFriendRequestAccepted(payload) {
        const senderSocket = this.sessionManager.getUserSocket(payload.userId);
        senderSocket && senderSocket.emit('onFriendRequestAccepted', payload);
    }
    emitFriendRequestRejected(payload) {
        const senderSocket = this.sessionManager.getUserSocket(payload.userId);
        senderSocket && senderSocket.emit('onFriendRequestRejected', payload);
    }
    onChannelJoin(data, client) {
        client.join(`channel-${data.channel.id}`);
        console.log(client.rooms);
        this.server.to(`channel-${data.channel.id}`).emit('userJoin');
    }
    onChannelLeave(data, client) {
        this.server.to(`Channel-${data.channel.id}`).emit('userLeave');
        client.leave(`Channel-${data.channel.id}`);
        console.log('onChannelLeave');
        console.log(client.rooms);
    }
    handleChannelCreate(payload) {
        this.server.emit("onChannel", payload);
        this.logger.log('event onChannel');
        console.log(`Inside conversation.create ${payload.creator.id}`);
        const client = this.sessionManager.getUserSocket(payload.creator.id);
        if (client) {
            client.join(`channel-${payload.channel.id}`);
            client.emit('onChannel', payload);
            this.server.to('onChannel').emit("onChannel", payload);
            this.logger.log('event onChannel');
        }
        this.logger.error('event onChannel failed');
    }
    handletest(payload) {
        this.server.emit("onChannel", payload);
        this.logger.log('event onChannel');
    }
    handleMessageSend(channelName, message) {
        try {
            this.server.to(channelName).emit('newMessage', message);
        }
        catch (error) {
            return;
        }
    }
    handleMessageCreateEvent(payload) {
        console.log('Inside message.create');
        const { author, recipient, message } = payload;
        const authorSocket = this.sessionManager.getUserSocket(author.id);
        const recipientSocket = this.sessionManager.getUserSocket(recipient.id);
        if (authorSocket)
            authorSocket.emit('onMessage', payload);
        if (recipientSocket)
            recipientSocket.emit('onMessage', payload);
    }
    async handleMessageDelete(payload) {
        console.log('Inside message.delete');
        console.log(payload);
        const message = await this.messageService.findMessageByMessageId(payload.message.id);
        if (!message)
            return;
        const creator = this.sessionManager.getUserSocket(message.userId);
        if (creator)
            creator.emit('onMessageDelete', payload);
    }
    async handleMessageUpdate(message) {
        const { author, recipient } = message;
        console.log(message);
        const recipientSocket = this.sessionManager.getUserSocket(message.message.userId);
        recipientSocket.emit('onMessageUpdate', message);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, event_emitter_1.OnEvent)('friendrequest.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "emitFriendRequestCreate", null);
__decorate([
    (0, event_emitter_1.OnEvent)('friendrequest.cancel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "emitFriendRequestCancel", null);
__decorate([
    (0, event_emitter_1.OnEvent)('friendrequest.accept'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "emitFriendRequestAccepted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('friendrequest.reject'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "emitFriendRequestRejected", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('onChannelJoin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChannelSocketDto, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "onChannelJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('onChannelLeave'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChannelSocketDto, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "onChannelLeave", null);
__decorate([
    (0, event_emitter_1.OnEvent)('channel.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChannelSocketDto]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleChannelCreate", null);
__decorate([
    (0, event_emitter_1.OnEvent)('channel.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handletest", null);
__decorate([
    (0, event_emitter_1.OnEvent)('message.send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessageSend", null);
__decorate([
    (0, event_emitter_1.OnEvent)('message.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.MessageSocketDto]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessageCreateEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('message.delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.MessageSocketDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageDelete", null);
__decorate([
    (0, event_emitter_1.OnEvent)('message.update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.MessageSocketDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageUpdate", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        }, namespace: "chat"
    }),
    __metadata("design:paramtypes", [chat_session_1.GatewaySessionManager, event_emitter_2.EventEmitter2,
        message_service_1.MessageService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map