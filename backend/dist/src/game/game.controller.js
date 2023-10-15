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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const match_dto_1 = require("../dto/match.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async createGame(req) {
        try {
            const id = Number(req.userId);
            const id1 = Number(req.userId1);
            return this.gameService.createMatch(id, id1);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Une erreur s\'est produite lors de la création du match.');
        }
    }
    async updatePlayerAScore(req, updateScoreDto) {
        try {
            const id = Number(req.userId);
            const match = await this.gameService.updatePlayerAScore(id, Number(updateScoreDto.score));
            if (!match)
                throw new common_1.NotFoundException(`Match with ID ${id} not found`);
            return match;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Une erreur s\'est produite lors de la mise à jour du score du joueur A.');
            }
        }
    }
    async updatePlayerBScore(req, updateScoreDto) {
        try {
            const id = Number(req.userId);
            const match = await this.gameService.updatePlayerBScore(id, Number(updateScoreDto.score));
            if (!match)
                throw new common_1.NotFoundException(`Match with ID ${id} not found`);
            return match;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Une erreur s\'est produite lors de la mise à jour du score du joueur B.');
            }
        }
    }
    async getMatchById(req) {
        try {
            const id = Number(req.userId);
            const match = await this.gameService.getMatchById(Number(id));
            if (!match)
                throw new common_1.NotFoundException(`Match with ID ${id} not found`);
            return match;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Une erreur s\'est produite lors de la récupération du match par ID.');
            }
        }
    }
    async getAllMatchesByPlayerId(req) {
        try {
            const id = Number(req.userId);
            const matches = await this.gameService.getAllMatchesByPlayerId(id);
            if (!matches || matches.length === 0)
                throw new common_1.NotFoundException(`No matches found for player with ID ${id}`);
            return matches;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Une erreur s\'est produite lors de la récupération des matches du joueur.');
            }
        }
    }
    async deleteMatch(req) {
        try {
            const id = Number(req.userId);
            const deletedMatch = await this.gameService.deleteMatch(id);
            if (!deletedMatch)
                throw new common_1.NotFoundException(`Match with ID ${id} not found`);
            return deletedMatch;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Une erreur s\'est produite lors de la suppression du match.');
            }
        }
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createGame", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)('updateScore/playerA'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, match_dto_1.UpdateScoreDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updatePlayerAScore", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)('updateScore/playerB'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, match_dto_1.UpdateScoreDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updatePlayerBScore", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getMatchById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('player/matches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getAllMatchesByPlayerId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "deleteMatch", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map