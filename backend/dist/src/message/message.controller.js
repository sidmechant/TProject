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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const update_message_dto_1 = require("./dto/update-message.dto");
const platform_express_1 = require("@nestjs/platform-express");
const event_emitter_1 = require("@nestjs/event-emitter");
const jwt_guard_1 = require("../auth/jwt.guard");
const get_message_dto_1 = require("./dto/get-message.dto");
const console_1 = require("console");
const chat_gateway_1 = require("../chat/chat.gateway");
const users_service_1 = require("../users/users.service");
let MessageController = class MessageController {
    constructor(messageService, chatGateway, userService, eventEmitter) {
        this.messageService = messageService;
        this.chatGateway = chatGateway;
        this.userService = userService;
        this.eventEmitter = eventEmitter;
    }
    async createMessage(req, createMessageDto) {
        try {
            createMessageDto.userId = req.user.id;
            const message = await this.messageService.create(createMessageDto);
            if (!message)
                throw new console_1.error();
            const recipient = await this.userService.getUserSocketDtoByUsername(createMessageDto.recepient);
            if (!recipient)
                throw new common_1.NotFoundException(`User ${createMessageDto.recepient} not found`);
            const messageSocketDto = { author: req.user, recipient: recipient, message: message };
            this.chatGateway.handleMessageCreateEvent(messageSocketDto);
            return { status: common_1.HttpStatus.OK, message: messageSocketDto, isSuccess: true };
        }
        catch (error) {
            return { status: common_1.HttpStatus.NOT_IMPLEMENTED, message: `Failed to create a new message. ${error.message}` };
        }
    }
    async findAllMessagesChannel(req, getMessageDto) {
        try {
            const messages = await this.messageService.findAllMessageBychannelId(getMessageDto.channelId);
            if (!messages)
                throw new console_1.error();
            const messageSocketDto = { author: req.user, recipient: req.userRecipent, messages: messages };
            this.chatGateway.handleMessageCreateEvent(messageSocketDto);
            return { status: common_1.HttpStatus.OK, message: messages, isSuccess: true };
        }
        catch (error) {
            return { status: common_1.HttpStatus.NOT_FOUND, message: `Failed to retrieve messages. ${error.message}` };
        }
    }
    async findAllMessages(req) {
        const id = req.user.id;
        try {
            const messages = await this.messageService.findAllMessageByUserId(id);
            if (!messages)
                throw new console_1.error();
            const messageSocketDto = { author: req.user, recipient: req.userRecipent, messages: messages };
            this.chatGateway.handleMessageCreateEvent(messageSocketDto);
            return { status: common_1.HttpStatus.OK, message: messages, isSuccess: true };
        }
        catch (error) {
            return { status: common_1.HttpStatus.NOT_FOUND, message: `Failed to retrieve the message. ${error.message}` };
        }
    }
    async findOneMessage(req, getMessageDto) {
        try {
            const messages = await this.messageService.findMessageByMessageId(getMessageDto.messageId);
            if (!messages)
                throw new console_1.error();
            const messageSocketDto = { author: req.user, recipient: req.userRecipent, message: messages };
            this.chatGateway.handleMessageCreateEvent(messageSocketDto);
            return { status: common_1.HttpStatus.OK, message: messages, isSuccess: true };
        }
        catch (error) {
            return { status: common_1.HttpStatus.NOT_FOUND, message: `Failed to retrieve the message. ${error.message}` };
        }
    }
    async updateMessage(req, updateMessageDto) {
        try {
            const message = await this.messageService.updateMessageByMessageIdUserID(req.user.id, updateMessageDto);
            if (!message)
                throw new console_1.error();
            const messageSocketDto = { author: req.user, recipient: req.userRecipent, message: message };
            this.chatGateway.handleMessageUpdate(messageSocketDto);
            return { status: common_1.HttpStatus.OK, message: message, isSuccess: true };
        }
        catch (error) {
            return { status: common_1.HttpStatus.NOT_MODIFIED, message: `Failed to update the message. Error ${error.message}` };
        }
    }
    async remove(req, updateMessageDto) {
        try {
            await this.messageService.removeMessageByMessageID(updateMessageDto.messageId);
            const messageSocketDto = { author: req.user, recipient: req.userRecipent };
            this.chatGateway.handleMessageUpdate(messageSocketDto);
            return { status: common_1.HttpStatus.OK, message: 'Message deleted successfully.' };
        }
        catch (error) {
            return { status: 'error', message: `Failed to delete the message. Error: ${error.message}` };
        }
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        {
            name: 'attachments',
            maxCount: 5,
        },
    ])),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('allMessagesChannel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_message_dto_1.GetMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findAllMessagesChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('myMessages'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findAllMessages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('myMessage'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_message_dto_1.GetMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findOneMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('updateMessage'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "remove", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('message'),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        chat_gateway_1.ChatGateway,
        users_service_1.UsersService,
        event_emitter_1.EventEmitter2])
], MessageController);
//# sourceMappingURL=message.controller.js.map