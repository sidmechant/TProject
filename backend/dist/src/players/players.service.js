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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
let PlayersService = class PlayersService {
    constructor(prisma, crudService) {
        this.prisma = prisma;
        this.crudService = crudService;
    }
    async getPlayerById(id) {
        try {
            const player = await this.prisma.player.findUnique({
                where: { id },
            });
            if (!player) {
                throw new common_1.NotFoundException(`Joueur avec l'ID ${id} introuvable`);
            }
            return player;
        }
        catch (error) {
            console.error('Erreur lors de la récupération du joueur par ID', error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la récupération du joueur par ID.");
        }
    }
    async findUserById(id) {
        return this.crudService.findUserById(id);
    }
    async setPlayerUrlPhotoProfile(id, urlPhotoProfile) {
        try {
            const updatedPlayer = await this.prisma.player.update({
                where: { id },
                data: { urlPhotoProfile },
            });
            if (!updatedPlayer) {
                throw new common_1.NotFoundException(`Joueur avec l'ID ${id} introuvable`);
            }
            return updatedPlayer;
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de l'URL de la photo du joueur", error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la mise à jour de l'URL de la photo du joueur.");
        }
    }
    async setPlayerPseudo(id, pseudo) {
        try {
            const updatedPlayer = await this.prisma.player.update({
                where: { id },
                data: { pseudo },
            });
            if (!updatedPlayer) {
                throw new common_1.NotFoundException(`Joueur avec l'ID ${id} introuvable`);
            }
            console.log("Hello_Hello", pseudo);
            return updatedPlayer;
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour du pseudo du joueur", error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la mise à jour du pseudo du joueur.");
        }
    }
    async getAllMatchesByPlayerId(id) {
        try {
            const player = await this.prisma.player.findUnique({
                where: { id },
                include: {
                    matchesA: true,
                    matchesB: true,
                },
            });
            if (!player) {
                throw new common_1.NotFoundException(`Joueur avec l'ID ${id} introuvable`);
            }
            const matchesA = player.matchesA || [];
            const matchesB = player.matchesB || [];
            const matches = [...matchesA, ...matchesB];
            return matches;
        }
        catch (error) {
            console.error('Erreur lors de la récupération de tous les matches joués par le joueur', error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la récupération de tous les matches joués par le joueur.");
        }
    }
    async getAllPlayers() {
        try {
            const players = await this.prisma.player.findMany();
            return players;
        }
        catch (error) {
            console.error('Erreur lors de la récupération de tous les joueurs', error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la récupération de tous les joueurs.");
        }
    }
    async deletePlayer(playerId) {
        try {
            const deletedPlayer = await this.prisma.player.delete({
                where: { id: playerId },
            });
            if (!deletedPlayer) {
                throw new common_1.NotFoundException(`Joueur avec l'ID ${playerId} introuvable`);
            }
            return deletedPlayer;
        }
        catch (error) {
            console.error("Erreur lors de la suppression du joueur", error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la suppression du joueur.");
        }
    }
    async addMatchToPlayer(playerId, matchId) {
        try {
            const existingPlayer = await this.getPlayerById(playerId);
            const updatedPlayer = await this.prisma.player.update({
                where: { id: playerId },
                data: {
                    matchesA: {
                        connect: [{ id: matchId }],
                    },
                },
            });
            return updatedPlayer;
        }
        catch (error) {
            console.error("Erreur lors de l'ajout du match au joueur", error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.NotFoundException("Une erreur s'est produite lors de la mise à jour du joueur.");
            }
        }
    }
    async isPseudoUnique(pseudo, id) {
        const existingPlayer = await this.prisma.player.findFirst({
            where: {
                pseudo,
                NOT: { id }
            }
        });
        return !existingPlayer;
    }
    async getPlayerByPseudo(pseudo) {
        try {
            const player = await this.prisma.player.findFirst({
                where: { pseudo },
                include: { user: true },
            });
            if (!player) {
                throw new common_1.NotFoundException(`Joueur avec le pseudo ${pseudo} introuvable`);
            }
            return player;
        }
        catch (error) {
            console.error('Erreur lors de la récupération du joueur par pseudo', error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la récupération du joueur par pseudo.");
        }
    }
    async getPhotoUrlById(id) {
        try {
            const player = await this.prisma.player.findUnique({
                where: { id },
                select: { urlPhotoProfile: true }
            });
            if (!player) {
                throw new common_1.NotFoundException(`Joueur avec l'ID ${id} introuvable`);
            }
            return player;
        }
        catch (error) {
            console.error("Erreur lors de la récupération de l'URL de la photo du joueur", error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la récupération de l'URL de la photo du joueur.");
        }
    }
    async checkProfileUpdated(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { player: true },
            });
            if (!user) {
                return false;
            }
            const hasPseudo = !!user.player?.pseudo;
            const hasUrlPhotoProfile = !!user.player?.urlPhotoProfile;
            if (hasPseudo && hasUrlPhotoProfile) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        isProfileUpdated: true,
                        role: 'USER',
                    },
                });
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Erreur lors de la vérification de la mise à jour du profil", error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la vérification de la mise à jour du profil.");
        }
    }
    async isTwoFactorAuthenticationEnabled(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { isTwoFactorAuthenticationEnabled: true }
            });
            if (!user) {
                throw new common_1.NotFoundException(`Utilisateur avec l'ID ${userId} introuvable`);
            }
            return user.isTwoFactorAuthenticationEnabled;
        }
        catch (error) {
            console.error("Erreur lors de la vérification de l'authentification à deux facteurs", error);
            throw new common_1.NotFoundException("Une erreur s'est produite lors de la vérification de l'authentification à deux facteurs.");
        }
    }
    async sendFriendRequest(senderId, receiverPseudo) {
        const receiverPlayer = await this.prisma.player.findFirst({ where: { pseudo: receiverPseudo } });
        if (!receiverPlayer) {
            throw new common_1.NotFoundException(`Joueur avec le pseudo ${receiverPseudo} introuvable`);
        }
        const receiverUserId = receiverPlayer.userId;
        const existingRequest = await this.prisma.friend.findFirst({
            where: { userId: senderId, friendId: receiverUserId }
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('Une demande a déjà été envoyée ou existe déjà entre ces deux utilisateurs.');
        }
        const blockedFriendship = await this.prisma.friend.findFirst({
            where: {
                userId: receiverUserId,
                friendId: senderId,
                status: 'blocked'
            }
        });
        if (blockedFriendship) {
            throw new common_1.ForbiddenException('You have been blocked by this user');
        }
        return this.prisma.friend.create({
            data: {
                userId: senderId,
                friendId: receiverUserId,
                status: 'requested'
            }
        });
    }
    async acceptFriendRequest(userId, requesterId) {
        const friendRequest = await this.prisma.friend.findFirst({
            where: { userId: requesterId, friendId: userId, status: 'requested' }
        });
        if (!friendRequest) {
            throw new common_1.NotFoundException('Demande d\'ami non trouvée ou déjà traitée.');
        }
        return this.prisma.friend.update({
            where: { id: friendRequest.id },
            data: { status: 'accepted' }
        });
    }
    async declineFriendRequest(userId, requesterId) {
        const friendRequest = await this.prisma.friend.findFirst({
            where: { userId: requesterId, friendId: userId, status: 'requested' }
        });
        if (!friendRequest) {
            throw new common_1.NotFoundException('Demande d\'ami non trouvée ou déjà traitée.');
        }
        return this.prisma.friend.update({
            where: { id: friendRequest.id },
            data: { status: 'declined' }
        });
    }
    async isBlockedByUser(senderId, receiverId) {
        try {
            const friendship = await this.prisma.friend.findFirst({
                where: {
                    userId: senderId,
                    friendId: receiverId,
                },
            });
            if (friendship?.status === 'blocked') {
                return true;
            }
            return false;
        }
        catch (error) {
            throw new Error('Une erreur s\'est produite lors de la vérification du blocage de l\'utilisateur.');
        }
    }
    async blockUser(userId, friendId) {
        try {
            const friendRelation = await this.prisma.friend.findUnique({
                where: {
                    id: userId,
                },
            });
            if (friendRelation) {
                await this.prisma.friend.update({
                    where: {
                        id: friendRelation.id,
                    },
                    data: {
                        status: 'blocked',
                    },
                });
            }
        }
        catch (error) {
            throw new Error('Une erreur s\'est produite lors du blocage de l\'utilisateur.');
        }
    }
    async updateUserStatus(userId, status) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    status: status,
                },
            });
            return updatedUser;
        }
        catch (error) {
            throw new Error('Une erreur s\'est produite lors de la mise à jour du statut de l\'utilisateur.');
        }
    }
    async getUserStatus(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (user) {
                return user.status;
            }
            else {
                throw new Error('Utilisateur non trouvé.');
            }
        }
        catch (error) {
            throw new Error('Une erreur s\'est produite lors de la récupération du statut de l\'utilisateur.');
        }
    }
    async getFriendsOfUser(userId) {
        const requestedFriends = await this.prisma.friend.findMany({
            where: {
                userId: userId,
                status: "accepted"
            },
            select: {
                friend: true
            }
        });
        const receivedFriends = await this.prisma.friend.findMany({
            where: {
                friendId: userId,
                status: "accepted"
            },
            select: {
                user: true
            }
        });
        const friends = [
            ...requestedFriends.map(f => f.friend),
            ...receivedFriends.map(f => f.user)
        ];
        return friends;
    }
    async getUsersOnline() {
        return await this.prisma.user.findMany({
            where: {
                status: "ONLINE"
            }
        });
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crud_service_1.CrudService])
], PlayersService);
//# sourceMappingURL=players.service.js.map