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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const channel_service_1 = require("../channel/channel.service");
let MessageService = class MessageService {
    constructor(prisma, channelService) {
        this.prisma = prisma;
        this.channelService = channelService;
    }
    async findChannelById(id) {
        try {
            const channel = await this.prisma.channel.findFirst({
                where: { id },
                include: {
                    messages: true,
                    owner: true,
                    members: true,
                }
            });
            if (!channel)
                return false;
            return true;
        }
        catch (err) {
            return null;
        }
    }
    async create(createMessageDto) {
        try {
            const { content, channelId, userId } = createMessageDto;
            const channel = this.channelService.findChannelByChannelIdOwnerId(channelId, createMessageDto.userId);
            if (!channel)
                throw new common_1.NotFoundException('cannal dont existe');
            const id = Number(userId);
            const message = await this.prisma.message.create({
                data: {
                    content,
                    channelId,
                    userId: id,
                },
            });
            return message;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create a new message. Error: ${error.message}`);
        }
    }
    async findMessageByMessageId(messageId) {
        try {
            const messages = await this.prisma.message.findFirst({
                where: { id: messageId },
            });
            return messages;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to retrieve messages.');
        }
    }
    async findAllMessageBychannelId(channelId) {
        try {
            const messages = await this.prisma.message.findMany({
                where: { channelId },
            });
            return messages;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to retrieve messages.');
        }
    }
    async findAllMessageByUserId(userId) {
        try {
            const id = Number(userId);
            const message = await this.prisma.message.findMany({
                where: { id: userId },
            });
            if (message)
                return message;
            throw new common_1.NotFoundException(`Message with id ${userId} not found.`);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve the message. ${error}`);
        }
    }
    async updateMessageByMessageIdUserID(userId, updateMessageDto) {
        try {
            const { content, messageId } = updateMessageDto;
            const id = Number(userId);
            const existingMessage = await this.prisma.message.findFirst({
                where: { id: messageId, userId: id },
            });
            if (!existingMessage)
                throw new common_1.NotFoundException(`Message with id ${messageId} not found.`);
            const updatedMessage = await this.prisma.message.update({
                where: { id: messageId, userId: id },
                data: { content },
            });
            return updatedMessage;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update the message.');
        }
    }
    async removeMessageByMessageID(messageId) {
        try {
            const existingMessage = await this.prisma.message.findUnique({
                where: { id: messageId },
            });
            if (!existingMessage) {
                throw new common_1.NotFoundException(`Message with id ${messageId} not found.`);
            }
            await this.prisma.message.delete({
                where: { id: messageId },
            });
            return { message: 'Message deleted successfully.' };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete the message. Error ${error.message}`);
        }
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, channel_service_1.ChannelService])
], MessageService);
//# sourceMappingURL=message.service.js.map