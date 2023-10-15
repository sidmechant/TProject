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
exports.PlayersController = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("./players.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const players_dto_1 = require("./players.dto");
const class_validator_1 = require("class-validator");
const common_2 = require("@nestjs/common");
let PlayersController = class PlayersController {
    constructor(playersService) {
        this.playersService = playersService;
    }
    async getPlayerbyId(req) {
        try {
            console.log("TRYING TO GET REQ.ID");
            const id = Number(req.userId);
            console.log("GOT THE ID: ", id);
            const player = await this.playersService.getPlayerById(id);
            console.log("GETTING PLAYER");
            if (!player) {
                throw new common_1.HttpException("Le player n'a pas été trouvé.", common_1.HttpStatus.NOT_FOUND);
            }
            const user = await this.playersService.findUserById(id);
            if (!user) {
                throw new common_1.HttpException("L'utilisateur n'a pas ete trouve", common_1.HttpStatus.NOT_FOUND);
            }
            const isProfileUpdated = await this.playersService.checkProfileUpdated(id);
            const isTwoFactorAuthEnabled = await this.playersService.isTwoFactorAuthenticationEnabled(id);
            return {
                player: player,
                role: user.role,
                isProfileUpdated: isProfileUpdated,
                isTwoFactorAuthEnabled: isTwoFactorAuthEnabled
            };
        }
        catch (error) {
            console.error("PROBLEME");
        }
    }
    async getPhotoUrl(req) {
        try {
            const id = Number(req.userId);
            const photourl = await this.playersService.getPhotoUrlById(id);
            return photourl;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Une erreur s'est produite lors de la récupération de l'URL de la photo du joueur.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setPlayerUrlPhotoProfile(req, updatePhotoDto) {
        try {
            const errors = await (0, class_validator_1.validate)(updatePhotoDto);
            if (errors.length > 0) {
                const errorMessage = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new common_1.HttpException(errorMessage, common_1.HttpStatus.BAD_REQUEST);
            }
            const id = Number(req.userId);
            const updatedPlayer = await this.playersService.setPlayerUrlPhotoProfile(id, updatePhotoDto.urlPhotoProfile);
            const isProfileUpdated = await this.playersService.checkProfileUpdated(id);
            return { updatedPlayer, isProfileUpdated };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Une erreur s'est produite lors de la mise à jour de l'URL de la photo du joueur.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setPlayerPseudo(req, dto) {
        try {
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                const errorMessage = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new common_1.HttpException(errorMessage, common_1.HttpStatus.BAD_REQUEST);
            }
            const id = Number(req.userId);
            if (!await this.playersService.isPseudoUnique(dto.pseudo, id)) {
                throw new common_1.HttpException('Le pseudo est déjà utilisé par un autre joueur.', common_1.HttpStatus.CONFLICT);
            }
            const pseudo = await this.playersService.setPlayerPseudo(id, dto.pseudo);
            const isProfileUpdated = await this.playersService.checkProfileUpdated(id);
            return { pseudo, isProfileUpdated };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Une erreur inattendue s’est produite.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllMatchesByPlayerId(req) {
        try {
            const id = Number(req.userId);
            const matches = await this.playersService.getAllMatchesByPlayerId(id);
            return matches;
        }
        catch (error) {
            throw new common_1.HttpException("Une erreur s'est produite lors de la récupération de tous les matches joués par le joueur.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPlayers() {
        console.log("getAllPlayers");
        try {
            const players = await this.playersService.getAllPlayers();
            return players;
        }
        catch (error) {
            throw new common_1.HttpException("Une erreur s'est produite lors de la récupération de tous les joueurs.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deletePlayer(req) {
        try {
            const playerId = req.userId;
            const deletedPlayer = await this.playersService.deletePlayer(playerId);
            return deletedPlayer;
        }
        catch (error) {
            throw new common_1.HttpException("Une erreur s'est produite lors de la suppression du joueur.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserByPseudo(params) {
        try {
            const errors = await (0, class_validator_1.validate)(params);
            if (errors.length > 0) {
                const errorMessage = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new common_2.BadRequestException(errorMessage);
            }
            const player = await this.playersService.getPlayerByPseudo(params.pseudo);
            if (!player) {
                throw new common_2.NotFoundException(`Joueur avec le pseudo ${params.pseudo} introuvable`);
            }
            return player;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Une erreur inattendue s'est produite.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendFriendRequest(req, dto) {
        try {
            const senderId = Number(req.userId);
            const receiver = await this.playersService.getPlayerByPseudo(dto.receiverPseudo);
            if (!receiver) {
                throw new common_1.HttpException("Joueur non trouvé.", common_1.HttpStatus.NOT_FOUND);
            }
            if (await this.playersService.isBlockedByUser(senderId, receiver.id)) {
                throw new common_1.HttpException("Vous avez été bloqué par cet utilisateur.", common_1.HttpStatus.FORBIDDEN);
            }
            const { receiverPseudo } = dto;
            return await this.playersService.sendFriendRequest(senderId, receiverPseudo);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Une erreur s'est produite lors de l'envoi de la demande d'ami.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async acceptFriendRequest(req, dto) {
        try {
            const userId = Number(req.userId);
            const { requesterId } = dto;
            return await this.playersService.acceptFriendRequest(userId, requesterId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Une erreur s'est produite lors de l'acceptation de la demande d'ami.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async declineFriendRequest(req, dto) {
        try {
            const userId = Number(req.userId);
            const { requesterId } = dto;
            return await this.playersService.declineFriendRequest(userId, requesterId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Une erreur s'est produite lors du refus de la demande d'ami.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchPseudo(req, pseudoToSearch) {
        try {
            const searcherId = Number(req.userId);
            const playerWithPseudo = await this.playersService.getPlayerByPseudo(pseudoToSearch);
            if (!playerWithPseudo) {
                throw new common_1.HttpException('Pseudo non trouvé.', common_1.HttpStatus.NOT_FOUND);
            }
            if (await this.playersService.isBlockedByUser(searcherId, playerWithPseudo.userId)) {
                throw new common_1.HttpException("Vous avez été bloqué par cet utilisateur.", common_1.HttpStatus.FORBIDDEN);
            }
            return playerWithPseudo;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Une erreur inattendue s’est produite.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PlayersController = PlayersController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "getPlayerbyId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('photo'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "getPhotoUrl", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('photo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, players_dto_1.UpdatePhotoDto]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "setPlayerUrlPhotoProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('pseudo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, players_dto_1.UpdatePseudoDto]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "setPlayerPseudo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('matches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "getAllMatchesByPlayerId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "getAllPlayers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('deleted'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "deletePlayer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/:pseudo'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [players_dto_1.PseudoDto]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "getUserByPseudo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/friend-request'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/friend-request/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "acceptFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/friend-request/decline'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "declineFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search-pseudo'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('pseudo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlayersController.prototype, "searchPseudo", null);
exports.PlayersController = PlayersController = __decorate([
    (0, common_1.Controller)('players'),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], PlayersController);
//# sourceMappingURL=players.controller.js.map