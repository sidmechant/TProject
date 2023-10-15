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
exports.GameGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const MatchMaking_1 = require("./MatchMaking");
const jwt = require("jsonwebtoken");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
const match = new MatchMaking_1.MatchMaking;
let GameGateway = class GameGateway {
    constructor(crudService) {
        this.crudService = crudService;
    }
    getUserIdByToken(token) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            throw new common_1.UnauthorizedException('JWT secret is not configured.');
        try {
            console.log("Debug: ", token);
            const decoded = jwt.verify(token, jwtSecret);
            if (!decoded || !decoded.userId || typeof decoded.userId !== 'string')
                throw new Error('Invalid token payload');
            return { userId: decoded.userId };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid JWT token.');
        }
    }
    handleConnection(client) {
    }
    handleDisconnect(client) {
        match.remove(client);
    }
    handleEventBall(client) {
        match.getRoom(client).ball(client);
    }
    handleEventChooseMap(client, data) {
        match.getRoom(client).chooseMap(client, data.map);
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: chooseMap', data.map);
    }
    handleEventConnect(client) {
        match.getRoom(client).connect();
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: connection');
    }
    handleEventJoin(client, data) {
        match.add(client);
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: join');
    }
    handleEventLeave(client) {
        match.remove(client);
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: leave');
    }
    handleEventMove(client, data) {
        match.getRoom(client).move(client, data.key);
    }
    handleEventPlayers(client) {
        match.getRoom(client).player(client);
    }
    handleEventRestart(client) {
        match.getRoom(client).restart();
        match.merge();
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: restart');
    }
    handleEventStart(client) {
        match.getRoom(client).start(client);
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: start');
    }
    handleEventPlay(client) {
        match.getRoom(client).play(client);
        const token = client.handshake.query.token;
        console.log('Client', token, ': event: play');
    }
    ;
    handleEventSkillInfo(client) {
        match.getRoom(client).skillInfo(client);
        const token = client.handshake.query.token;
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ball'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventBall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chooseMap'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventChooseMap", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('connection'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventConnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('players'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventPlayers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('restart'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventRestart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('play'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventPlay", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('skillInfo'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleEventSkillInfo", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }),
    __metadata("design:paramtypes", [crud_service_1.CrudService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map