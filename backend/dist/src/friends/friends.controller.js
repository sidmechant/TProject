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
exports.FriendsController = void 0;
const friends_service_1 = require("./friends.service");
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const players_service_1 = require("../players/players.service");
const throttler_1 = require("@nestjs/throttler");
const event_emitter_1 = require("@nestjs/event-emitter");
let FriendsController = class FriendsController {
    constructor(friendsService, playersService, eventEmitter) {
        this.friendsService = friendsService;
        this.playersService = playersService;
        this.eventEmitter = eventEmitter;
    }
    async sendFriendRequest(req, dto) {
        try {
            const senderId = Number(req.userId);
            const receiver = await this.playersService.getPlayerByPseudo(dto.receiverPseudo);
            if (!receiver) {
            }
            if (await this.friendsService.isBlockedByUser(senderId, receiver.id)) {
            }
            const { receiverPseudo } = dto;
            const friendRequest = await this.friendsService.sendFriendRequest(senderId, receiverPseudo);
            this.eventEmitter.emit('friendrequest.create', friendRequest);
            return friendRequest;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                return;
        }
    }
    async acceptFriendRequest(req, dto) {
        try {
            const userId = Number(req.userId);
            const { requesterId } = dto;
            const friend = await this.friendsService.acceptFriendRequest(userId, requesterId);
            this.eventEmitter.emit('friendrequest.accept', friend);
            return friend;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                return;
        }
    }
    async declineFriendRequest(req, dto) {
        try {
            const userId = Number(req.userId);
            const { requesterId } = dto;
            const friend = await this.friendsService.declineFriendRequest(userId, requesterId);
            this.eventEmitter.emit('friendrequest.reject', friend);
            return friend;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                return;
        }
    }
    async searchPseudo(req, pseudoToSearch) {
        try {
            const searcherId = Number(req.userId);
            const playerWithPseudo = await this.playersService.getPlayerByPseudo(pseudoToSearch);
            if (!playerWithPseudo) {
                return;
            }
            if (await this.friendsService.isBlockedByUser(searcherId, playerWithPseudo.userId)) {
                return;
            }
            return playerWithPseudo;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                return;
        }
    }
    async getFriends(req) {
        try {
            const userId = Number(req.userId);
            return await this.friendsService.getFriends(userId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                return;
        }
    }
    async getUsersOnline() {
        try {
            return await this.friendsService.getUsersOnline();
        }
        catch (error) {
            return;
        }
    }
    async getFriendsOnline(req) {
        try {
            const userId = Number(req.user.id);
            const friendsOnline = await this.friendsService.getFriendsOnline(userId);
            this.eventEmitter.emit('friends.online.list', { userId });
            return friendsOnline;
        }
        catch (error) {
            return;
        }
    }
    async getFriendlist(req) {
        try {
            const userId = Number(req.userId);
            const pendingFriends = await this.friendsService.getPendingFriends(userId);
            const acceptedFriends = await this.friendsService.getAcceptedFriends(userId);
            console.log("pend: ", pendingFriends);
            console.log("acc : ", acceptedFriends);
            const allFriends = [
                ...pendingFriends.map(friend => ({ ...friend, status: 'requested' })),
                ...acceptedFriends.map(friend => ({ ...friend, status: 'accepted' }))
            ];
            return allFriends;
        }
        catch (error) {
            return;
        }
    }
    async getPendingFriends(req) {
        try {
            const userId = Number(req.userId);
            const pendingFriends = await this.friendsService.getPendingFriends(userId);
            this.eventEmitter.emit('friends.pending.list', { userId });
            return pendingFriends;
        }
        catch (error) {
            return;
        }
    }
    async getAcceptedFriends(req) {
        const id = req.userId;
        const userId = Number(req.userId);
        const acceptedFriends = await this.friendsService.getAcceptedFriends(userId);
        return acceptedFriends;
    }
    async getBlockedUsers(req) {
        const id = req.userId;
        const userId = Number(req.userId);
        return await this.friendsService.getBlockedUsers(userId);
    }
};
exports.FriendsController = FriendsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/friend-request'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/friend-request/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "acceptFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/friend-request/decline'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "declineFriendRequest", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search-pseudo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('pseudo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "searchPseudo", null);
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('friends'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getFriends", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('users-online'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getUsersOnline", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('friends-online'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getFriendsOnline", null);
__decorate([
    (0, common_1.Get)('friendlist'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getFriendlist", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getPendingFriends", null);
__decorate([
    (0, common_1.Get)('accepted'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getAcceptedFriends", null);
__decorate([
    (0, common_1.Get)('blocked'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getBlockedUsers", null);
exports.FriendsController = FriendsController = __decorate([
    (0, common_1.Controller)('friends'),
    __metadata("design:paramtypes", [friends_service_1.FriendsService,
        players_service_1.PlayersService,
        event_emitter_1.EventEmitter2])
], FriendsController);
//# sourceMappingURL=friends.controller.js.map