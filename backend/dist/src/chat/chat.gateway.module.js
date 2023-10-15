"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGatewayModule = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("./chat.gateway");
const chat_gateway_service_1 = require("./chat-gateway.service");
const chat_session_1 = require("./chat.session");
const friends_module_1 = require("../friends/friends.module");
const friends_service_1 = require("../friends/friends.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const message_service_1 = require("../message/message.service");
const channel_service_1 = require("../channel/channel.service");
const users_service_1 = require("../users/users.service");
let ChatGatewayModule = class ChatGatewayModule {
};
exports.ChatGatewayModule = ChatGatewayModule;
exports.ChatGatewayModule = ChatGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [friends_module_1.FriendsModule],
        providers: [
            users_service_1.UsersService,
            message_service_1.MessageService,
            chat_gateway_1.ChatGateway,
            chat_gateway_service_1.ChatGatewayService,
            channel_service_1.ChannelService,
            friends_service_1.FriendsService,
            chat_session_1.GatewaySessionManager,
            event_emitter_1.EventEmitter2,
        ],
    })
], ChatGatewayModule);
//# sourceMappingURL=chat.gateway.module.js.map