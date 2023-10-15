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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaySessionManager = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const friends_service_1 = require("../friends/friends.service");
let GatewaySessionManager = class GatewaySessionManager {
    constructor(FriendService) {
        this.FriendService = FriendService;
        this.sessions = new Map();
    }
    getUserSocket(id) {
        return this.sessions.get(id);
    }
    setUserSocket(token, id) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            const userId = decoded.sub;
            const numberUserId = Number(userId);
            this.sessions.set(numberUserId, id);
            this.FriendService.setOnlineStatus(numberUserId, true);
            console.log("SESSSION CHAT MANAGER Connect", numberUserId);
        }
        catch (error) {
        }
    }
    removeUserSocket(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            const userId = decoded.sub;
            const numberUserId = Number(userId);
            this.sessions.delete(numberUserId);
            this.FriendService.setOnlineStatus(numberUserId, false);
            console.log("SESSSION CHAT MANAGER Disconnect", numberUserId);
        }
        catch (error) {
        }
    }
    getSockets() {
        return this.sessions;
    }
};
exports.GatewaySessionManager = GatewaySessionManager;
exports.GatewaySessionManager = GatewaySessionManager = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [friends_service_1.FriendsService])
], GatewaySessionManager);
//# sourceMappingURL=chat.session.js.map