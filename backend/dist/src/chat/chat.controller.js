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
const chat_service_1 = require("./chat.service");
const chat_dto_1 = require("./chat.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
const channel_dto_1 = require("../dto/channel.dto");
let ChannelController = class ChannelController {
    constructor(channelService, crud) {
        this.channelService = channelService;
        this.crud = crud;
    }
    async createChannel(createChannelDto, req) {
        try {
            console.log("je suis createChannel ..... ");
            const id = (req.userId);
            createChannelDto.ownerId = id;
            const newChannel = await this.channelService.createChannel(createChannelDto);
            console.log("Success create channel", newChannel);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Channel created successfully.',
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
    async findChannelByName(searchChannelDto) {
        try {
            console.log("je suis findChannelByName ...... ");
            const channel = await this.channelService.findChannelByName(searchChannelDto.name);
            console.log("Sucess findChannrlByName ..... ");
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
    async getChannelsByUser(req) {
        try {
            console.log("je suis dans getChannelsByUser ...... ");
            const id = Number(req.userId);
            const channels = await this.channelService.getChannelsByUserId(id);
            console.log("Sucess getChannelsByUser ..... ");
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
    async findAll() {
        try {
            console.log("Je suis findAll ....... ");
            const channels = await this.channelService.findAllChannels();
            const newChannels = channels.filter(elem => elem.type === "public");
            console.log("Sucess findAll ..... ");
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
    async updateChannel(req, updateChannelDto) {
        try {
            console.log("je suis dans updateChannel ..... ");
            const id = Number(req.userId);
            console.log("Sucess updateChannel ..... ");
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
    async deleteChannelByName(request) {
        try {
            console.log("Je suis dans deleteChannelByName ...... ");
            await this.channelService.deleteChannelByNameAndOwnerId(request.query.name, request.userId);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: "Delete channel successfully",
                isSuccess: true
            };
        }
        catch (error) {
            console.log(" DEBUG ", error.message);
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
    async deleteAllUserChannels(request) {
        try {
            await this.channelService.deleteAllChannelsByOwnerId(request.userId);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Tous les canaux de l\'utilisateur ont été supprimés avec succès.',
                isSuccess: true
            };
        }
        catch (error) {
            console.log("DEBUG", error.message);
            if (error instanceof common_1.HttpException) {
                return {
                    statusCode: common_1.HttpStatus.NOT_IMPLEMENTED,
                    message: error.message,
                    isSuccess: true
                };
            }
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: "Bad request.",
                isSuccess: false
            };
        }
    }
};
exports.ChannelController = ChannelController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('created'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channel_dto_1.CreateChannelDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SearchChannelByNameDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "findChannelByName", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/channel'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelsByUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('allChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)('updateById'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.UpdateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('deleteByName'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannelByName", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('deleteAll'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteAllUserChannels", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [chat_service_1.ChannelService, crud_service_1.CrudService])
], ChannelController);
//# sourceMappingURL=chat.controller.js.map