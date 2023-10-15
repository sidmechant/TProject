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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const channel_dto_1 = require("../dto/channel.dto");
const console_1 = require("console");
const chat_gateway_1 = require("../chat/chat.gateway");
const jwt_guard_1 = require("../auth/jwt.guard");
let ChannelController = class ChannelController {
    constructor(channelService, chatgateway) {
        this.channelService = channelService;
        this.chatgateway = chatgateway;
        this.logger = new common_1.Logger('ChannelController');
    }
    async createChannel(createChannelDto) {
        this.logger.debug(`EntryPoint begin try ${createChannelDto}`);
        console.log("ICI");
        try {
            this.logger.debug(`entryPoint`);
            const newChannel = await this.channelService.createChannel(createChannelDto);
            if (!newChannel)
                throw (0, console_1.error)();
            this.logger.debug(`Channel created ${newChannel}`);
            const channelSocketDto = await this.channelService.getChannelSocketDtoByChannel(newChannel);
            if (!channelSocketDto)
                throw new common_1.NotFoundException(`Channel ${channelSocketDto.channel.name} not found`);
            this.logger.debug(`begin event ${channelSocketDto}`);
            this.chatgateway.handleChannelCreate(channelSocketDto);
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
    async findChannelByName(searchChannelDto) {
        try {
            const channel = await this.channelService.findChannelByName(searchChannelDto.name);
            return {
                statusCode: common_1.HttpStatus.FOUND,
                data: channel,
                message: 'Channel retrieved successfully.',
                isSuccess: true
            };
        }
        catch (error) {
            console.log("DEBUG", error.message);
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'bad request.',
                isSuccess: false
            };
        }
    }
    async findAll() {
        try {
            const channels = await this.channelService.findAllChannels();
            const newChannels = channels.filter(elem => elem.type === "public");
            return {
                statusCode: common_1.HttpStatus.FOUND,
                data: newChannels,
                message: 'Channels retrieved successfully.',
                isSuccess: true
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
                message: 'bad request.',
                isSuccess: false
            };
        }
    }
    async updateChannel(userId, req, updateChannelDto) {
        try {
            const id = Number(userId);
            const updatedChannel = await this.channelService.updateChannelByUserId(req.userId, updateChannelDto);
            return {
                statusCode: common_1.HttpStatus.OK,
                data: updatedChannel,
                message: 'Channel updated successfully.',
                isSuccess: true
            };
        }
        catch (error) {
            console.log("DEBUG", error.message);
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false
                };
            }
        }
    }
    async getChannelsByUser(userId, request) {
        try {
            console.log("je suis dans getChannelsByUser");
            const id = Number(userId);
            const channels = await this.channelService.getChannelsByUserId(id);
            return {
                statusCode: common_1.HttpStatus.FOUND,
                data: channels,
                message: 'Channels retrieved successfully.',
                isSuccess: true
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
                message: 'bad request.',
                isSuccess: false
            };
        }
    }
    async getMissingChannels(userId, request) {
        try {
            const id = Number(userId);
            const userChannels = await this.channelService.getChannelsByUserId(id);
            const allChannels = await this.channelService.findAllChannels();
            const missingChannels = allChannels.filter((channel) => {
                return !userChannels.some((userChannel) => userChannel.id === channel.id);
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                data: missingChannels,
                message: 'Missing channels retrieved successfully.',
                isSuccess: true,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: error.getStatus(),
                    message: error.message,
                    isSuccess: false,
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Bad request.',
                isSuccess: false,
            };
        }
    }
    async deleteChannelByName(request) {
        try {
            await this.channelService.deleteChannelByNameAndOwnerId(request.query.name, request.userId);
            return {
                statusCode: 200,
                message: 'Canal supprimé avec succès.',
                isSuccess: true
            };
        }
        catch (error) {
            console.log("DEBUG", error.message);
            if (error instanceof common_1.NotFoundException) {
                return {
                    statusCode: 404,
                    message: error.message,
                    isSuccess: false
                };
            }
            else if (error instanceof common_1.UnauthorizedException) {
                return {
                    statusCode: 401,
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: 400,
                message: 'Échec de la suppression du canal en raison d\'une mauvaise requête.',
                isSuccess: false
            };
        }
    }
    async deleteAllUserChannels(request) {
        try {
            await this.channelService.deleteAllChannelsByOwnerId(request.userId);
            return {
                statusCode: 200,
                message: 'Tous les canaux de l\'utilisateur ont été supprimés avec succès.',
                isSuccess: true
            };
        }
        catch (error) {
            console.log("DEBUG", error.message);
            if (error instanceof common_1.UnauthorizedException) {
                return {
                    statusCode: 401,
                    message: error.message,
                    isSuccess: false
                };
            }
            return {
                statusCode: 400,
                message: 'Échec de la suppression de tous les canaux de l\'utilisateur en raison d\'une mauvaise requête.',
                isSuccess: false
            };
        }
    }
};
exports.ChannelController = ChannelController;
__decorate([
    (0, common_1.Post)('created'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.SearchChannelByNameDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "findChannelByName", null);
__decorate([
    (0, common_1.Get)('allChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)('updateById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, channel_dto_1.UpdateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.Get)('/channel/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelsByUser", null);
__decorate([
    (0, common_1.Get)('missingChannels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getMissingChannels", null);
__decorate([
    (0, common_1.Delete)('delete-by-name'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannelByName", null);
__decorate([
    (0, common_1.Delete)('user/delete-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteAllUserChannels", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService, chat_gateway_1.ChatGateway])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map