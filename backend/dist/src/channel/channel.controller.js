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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channel_dto_1 = require("../dto/channel.dto");
const throttler_1 = require("@nestjs/throttler");
const jwt_guard_1 = require("../auth/jwt.guard");
const event_emitter_1 = require("@nestjs/event-emitter");
const channel_service_1 = require("./channel.service");
const console_1 = require("console");
const chat_gateway_1 = require("../chat/chat.gateway");
const prisma_service_1 = require("../../prisma/prisma.service");
let ChannelsController = class ChannelsController {
    constructor(events, channelService, chatGateway, prisma) {
        this.events = events;
        this.channelService = channelService;
        this.chatGateway = chatGateway;
        this.prisma = prisma;
        this.logger = new common_1.Logger('ChannelsController');
    }
    test() {
        this.logger.log(`TEST SUCCESS ...`);
        this.chatGateway.handletest(null);
        return;
    }
    async createChannel(req, createChannelDto) {
        this.logger.debug(`EntryPoint begin try ${createChannelDto}`);
        try {
            this.logger.debug(`entryPoint`);
            createChannelDto.ownerId = Number(req.userId);
            this.logger.debug(`DATA name:
        ${createChannelDto.name}
        ownerId: ${createChannelDto.ownerId}
        password: ${createChannelDto.password}
        type: ${createChannelDto.type}
        username ${createChannelDto.username}`);
            const newChannel = await this.channelService.createChannel(createChannelDto);
            if (!newChannel)
                throw (0, console_1.error)();
            this.logger.debug(`Channel created ${newChannel}`);
            const channelSocketDto = await this.channelService.getChannelSocketDtoByChannel(newChannel);
            if (!channelSocketDto)
                throw new common_1.NotFoundException(`Channel ${channelSocketDto.channel.name} not found`);
            this.logger.debug(`begin event ${channelSocketDto}`);
            this.chatGateway.handleChannelCreate(channelSocketDto);
            this.logger.debug(`EndPoint ${channelSocketDto}`);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Channel created successfully.',
                isSuccess: true
            };
        }
        catch (error) {
            this.logger.error(`Error ${error.message}`);
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request',
                isSuccess: false
            };
        }
    }
    async addMemberToChannel(getChannelDto) {
        try {
            const channelId = getChannelDto.channelId;
            const userId = Number(getChannelDto.userId);
            const updatedChannel = await this.channelService.addMemberToChannel(channelId, userId);
            if (!updatedChannel)
                throw new common_1.NotFoundException('Channel not found.');
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Member added to the channel successfully.',
                isSuccess: true,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request',
                isSuccess: false
            };
        }
    }
    async removeMemberFromChannel(getChannelDto) {
        try {
            const { channelId, userId } = getChannelDto;
            const updatedChannel = await this.channelService.removeMemberFromChannel(channelId, Number(userId));
            if (!updatedChannel)
                throw new common_1.NotFoundException('Channel or member not found.');
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Member removed from the channel successfully.',
                isSuccess: true,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request',
                isSuccess: false
            };
        }
    }
    async listMembersByChannelId(getChannelDto) {
        try {
            const members = await this.channelService.listMembersByChannelId(getChannelDto.channelId);
            if (!members)
                throw new common_1.NotFoundException('Channel not found.');
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Members listed successfully.',
                isSuccess: true,
                members,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false,
                    members: [],
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request',
                isSuccess: false,
                members: [],
            };
        }
    }
    async listMessageByChannelId(getChannelDto) {
        try {
            const messages = await this.channelService.listMessageByChannelId(getChannelDto.channelId);
            if (!messages)
                throw new common_1.NotFoundException('Channel not found');
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Members listed successfully.',
                isSuccess: true,
                messages: messages,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false,
                    messages: [],
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request',
                isSuccess: false,
                messages: [],
            };
        }
    }
    async addMessageToChannel(getChannelDto, content) {
        try {
            const channelId = getChannelDto.channelId;
            const userId = Number(getChannelDto.userId);
            const updatedChannel = await this.channelService.addMessageToChannel(channelId, userId, content);
            if (!updatedChannel)
                throw new common_1.NotFoundException('Channel not found.');
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Message added to the channel successfully.',
                isSuccess: true,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request',
                isSuccess: false
            };
        }
    }
    async getAllUserChannelWithMembers(req) {
        try {
            const channels = await this.prisma.channel.findMany({
                where: {
                    members: {
                        some: {
                            userId: Number(req.userId),
                        },
                    },
                },
                include: {
                    members: {
                        select: {
                            user: {
                                select: {
                                    player: true
                                }
                            }
                        }
                    }
                }
            });
            const formattedChannels = channels.map(channel => {
                return {
                    channelId: channel.id,
                    channelName: channel.name,
                    ownerId: channel.ownerId,
                    players: channel.members.map(member => member.user.player).filter(player => player)
                };
            });
            return formattedChannels;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return null;
            }
        }
    }
    async joinChannel(joinChannelDto) {
        try {
            const { userId, channelId } = joinChannelDto;
            const updatedChannel = await this.channelService.addMemberToChannel(channelId, Number(userId));
            if (!updatedChannel) {
                throw new common_1.NotFoundException('User or channel not found.');
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async leaveChannel(joinChannelDto) {
        try {
            const { userId, channelId } = joinChannelDto;
            const isMembershipRemoved = await this.channelService.removeChannelMembershipToUser(channelId, Number(userId));
            if (!isMembershipRemoved) {
                throw new common_1.NotFoundException('User or channel not found.');
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async getAvailableChannels(req) {
        try {
            const userId = Number(req.userId);
            const channels = await this.channelService.getAvailableChannelsForUser(userId);
            if (!channels || channels.length === 0) {
                throw new Error();
            }
            return channels;
        }
        catch (error) {
            return null;
        }
    }
    async sendMessage(req, createMessageDto) {
        try {
            createMessageDto.userId = req.userId;
            if (!createMessageDto.userId)
                throw new common_1.NotFoundException('User not found');
            const updatedMessages = await this.channelService.addMessageInChannel(createMessageDto);
            const message = updatedMessages[updatedMessages.length - 1].content;
            this.chatGateway.handleMessageSend(createMessageDto.channelName, message);
            return updatedMessages || null;
        }
        catch (error) {
            return null;
        }
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('created-channel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Post)('add-member-channel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.GetChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "addMemberToChannel", null);
__decorate([
    (0, common_1.Delete)('remove-member-channel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.GetChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "removeMemberFromChannel", null);
__decorate([
    (0, common_1.Get)('list-members-channel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.GetChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "listMembersByChannelId", null);
__decorate([
    (0, common_1.Get)('list-message-channel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.GetChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "listMessageByChannelId", null);
__decorate([
    (0, common_1.Post)('add-message-channel'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.GetChannelDto, String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "addMessageToChannel", null);
__decorate([
    (0, common_1.Get)('all_from_id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getAllUserChannelWithMembers", null);
__decorate([
    (0, common_1.Post)('join-channel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.JoinChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "joinChannel", null);
__decorate([
    (0, common_1.Post)('leave-channel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.JoinChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.Get)('available-channels'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getAvailableChannels", null);
__decorate([
    (0, common_1.Post)('send-message'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, channel_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "sendMessage", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Controller)('channel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        channel_service_1.ChannelService,
        chat_gateway_1.ChatGateway,
        prisma_service_1.PrismaService])
], ChannelsController);
//# sourceMappingURL=channel.controller.js.map