"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("../prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const players_module_1 = require("./players/players.module");
const game_module_1 = require("./game/game.module");
const core_1 = require("@nestjs/core");
const TwoFactorAuthenticationGuard_1 = require("./auth/2faGuard/TwoFactorAuthenticationGuard");
const crud_service_1 = require("./auth/forty-twoapi/crud.service");
const jwt_guard_1 = require("./auth/jwt.guard");
const chat_gateway_module_1 = require("./chat/chat.gateway.module");
const channel_module_1 = require("./channel/channel.module");
const friends_module_1 = require("./friends/friends.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [chat_gateway_module_1.ChatGatewayModule, auth_module_1.AuthModule, prisma_module_1.PrismaModule, users_module_1.UsersModule, players_module_1.PlayersModule, game_module_1.GameModule, channel_module_1.ChannelModule, friends_module_1.FriendsModule],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: TwoFactorAuthenticationGuard_1.TwoFactorAuthenticationGuard,
            },
            crud_service_1.CrudService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map