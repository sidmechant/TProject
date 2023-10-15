"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModule = void 0;
const common_1 = require("@nestjs/common");
const channel_controller_1 = require("./channel.controller");
const channel_service_1 = require("./channel.service");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const users_service_1 = require("../users/users.service");
const chat_gateway_1 = require("../chat/chat.gateway");
const chat_session_1 = require("../chat/chat.session");
const friends_service_1 = require("../friends/friends.service");
const message_service_1 = require("../message/message.service");
let ChannelModule = class ChannelModule {
};
exports.ChannelModule = ChannelModule;
exports.ChannelModule = ChannelModule = __decorate([
    (0, common_1.Module)({ imports: [], providers: [message_service_1.MessageService, friends_service_1.FriendsService, chat_session_1.GatewaySessionManager, chat_gateway_1.ChatGateway, crud_service_1.CrudService, channel_service_1.ChannelService, users_service_1.UsersService, event_emitter_1.EventEmitter2], controllers: [channel_controller_1.ChannelsController] })
], ChannelModule);
//# sourceMappingURL=channel.module.js.map