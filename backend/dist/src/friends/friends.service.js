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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FriendsService = class FriendsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFriendsOfUser(userId) {
        const requestedFriends = await this.prisma.friend.findMany({
            where: { userId: userId, status: "accepted" },
            select: { friend: { include: { player: true } } }
        });
        const receivedFriends = await this.prisma.friend.findMany({
            where: { friendId: userId, status: "accepted" },
            select: { user: { include: { player: true } } }
        });
        const friends = [
            ...requestedFriends.map(f => f.friend),
            ...receivedFriends.map(f => f.user)
        ];
        return friends;
    }
    async getBlockedUsers(userId) {
        const blockedRelations = await this.prisma.friend.findMany({
            where: { userId: userId, status: 'blocked' },
            select: { friend: { include: { player: true } } }
        });
        return blockedRelations.map(relation => relation.friend);
    }
    async getUsersOnline() {
        return this.prisma.user.findMany({
            where: { status: "ONLINE" },
            include: { player: true }
        });
    }
    async getPendingFriends(userId) {
        const pendingRequests = await this.prisma.friend.findMany({
            where: { friendId: userId, status: "requested" },
            select: { user: { include: { player: true } } }
        });
        return pendingRequests.map(f => f.user);
    }
    async getFriends(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                requestedFriends: {
                    where: { status: 'accepted' },
                    include: { friend: { include: { player: true } } },
                },
                receivedRequests: {
                    where: { status: 'accepted' },
                    include: { user: { include: { player: true } } },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé.');
        }
        const requestedFriends = user.requestedFriends;
        const receivedFriends = user.receivedRequests;
        return [...requestedFriends, ...receivedFriends];
    }
    async getAcceptedFriends(userId) {
        const acceptedFriendships = await this.prisma.friend.findMany({
            where: {
                AND: [
                    { status: 'accepted' },
                    {
                        OR: [
                            { userId: userId },
                            { friendId: userId }
                        ]
                    }
                ]
            },
            include: {
                user: {
                    include: {
                        player: true
                    }
                },
                friend: {
                    include: {
                        player: true
                    }
                }
            }
        });
        const acceptedFriendsWithPseudo = [];
        for (const friendship of acceptedFriendships) {
            if (friendship.userId === userId) {
                acceptedFriendsWithPseudo.push({ user: friendship.friend, player: friendship.friend.player });
            }
            else {
                acceptedFriendsWithPseudo.push({ user: friendship.user, player: friendship.user.player });
            }
        }
        return acceptedFriendsWithPseudo;
    }
    async getFriendsOnline(userId) {
        const userWithFriends = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                requestedFriends: {
                    where: { status: 'accepted' },
                    include: { friend: true }
                },
                receivedRequests: {
                    where: { status: 'accepted' },
                    include: { user: true }
                }
            }
        });
        if (!userWithFriends) {
            throw new Error("User not found");
        }
        const allFriends = [
            ...userWithFriends.requestedFriends.map(fr => fr.friend),
            ...userWithFriends.receivedRequests.map(fr => fr.user)
        ];
        const onlineFriends = allFriends.filter(friend => friend.status === "ONLINE");
        return onlineFriends;
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
    async setOnlineStatus(userId, online) {
        const status = online ? 'ONLINE' : 'OFFLINE';
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: status }
        });
    }
    async findFriendById(id) {
        const friend = await this.prisma.friend.findUnique({ where: { id } });
        if (!friend) {
            throw new common_1.NotFoundException('Ami non trouvé.');
        }
        return friend;
    }
    async deleteFriend(id, userId) {
        const friend = await this.findFriendById(id);
        if (!friend) {
            throw new common_1.NotFoundException('Ami non trouvé.');
        }
        if (friend.userId !== userId && friend.friendId !== userId) {
            throw new common_1.ForbiddenException('Vous n\'avez pas la permission de supprimer cet ami.');
        }
        await this.prisma.friend.delete({ where: { id } });
        return friend;
    }
    async isFriends(userOneId, userTwoId) {
        const friendship = await this.prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        userId: userOneId,
                        friendId: userTwoId,
                        status: 'accepted',
                    },
                    {
                        userId: userTwoId,
                        friendId: userOneId,
                        status: 'accepted',
                    },
                ],
            },
        });
        return !!friendship;
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendsService);
//# sourceMappingURL=friends.service.js.map