import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Player, User, Friend, UserStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async  getFriendsOfUser(userId: number) {
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


  async sendFriendRequest(senderId: number, receiverPseudo: string): Promise<Friend> {
    const receiverPlayer = await this.prisma.player.findFirst({ where: { pseudo: receiverPseudo } });

    if (!receiverPlayer) {
      throw new NotFoundException(`Joueur avec le pseudo ${receiverPseudo} introuvable`);
    }

    const receiverUserId = receiverPlayer.userId;

    const existingRequest = await this.prisma.friend.findFirst({
      where: { userId: senderId, friendId: receiverUserId }
    });

    if (existingRequest) {
      throw new BadRequestException('Une demande a déjà été envoyée ou existe déjà entre ces deux utilisateurs.');
    }

    const blockedFriendship = await this.prisma.friend.findFirst({ 
      where: { 
        userId: receiverUserId, 
        friendId: senderId, 
        status: 'blocked'
      } 
    });

    if (blockedFriendship) {
      throw new ForbiddenException('You have been blocked by this user');
    }

    return this.prisma.friend.create({
      data: {
        userId: senderId,
        friendId: receiverUserId,
        status: 'requested'
      }
    });
  }

  async acceptFriendRequest(userId: number, requesterId: number): Promise<Friend> {
    const friendRequest = await this.prisma.friend.findFirst({
      where: { userId: requesterId, friendId: userId, status: 'requested' }
    });

    if (!friendRequest) {
      throw new NotFoundException('Demande d\'ami non trouvée ou déjà traitée.');
    }

    return this.prisma.friend.update({
      where: { id: friendRequest.id },
      data: { status: 'accepted' }
    });
  }

  async declineFriendRequest(userId: number, requesterId: number): Promise<Friend> {
    const friendRequest = await this.prisma.friend.findFirst({
      where: { userId: requesterId, friendId: userId, status: 'requested' }
    });

    if (!friendRequest) {
      throw new NotFoundException('Demande d\'ami non trouvée ou déjà traitée.');
    }

    return this.prisma.friend.update({
      where: { id: friendRequest.id },
      data: { status: 'declined' }
    });
  }

  async isBlockedByUser(senderId: number, receiverId: number): Promise<boolean> {
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
    } catch (error) {
      throw new Error('Une erreur s\'est produite lors de la vérification du blocage de l\'utilisateur.');
    }
  }

  async getUsersOnline(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        status: "ONLINE"
      }
    });
  }
  
  async setOnlineStatus(userId: number, online: boolean) {
    const status = online ? 'ONLINE' : 'OFFLINE';
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status }
    });
  }

  async getFriends(userId: number): Promise<Friend[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        requestedFriends: {
          where: { status: 'accepted' },
          include: { friend: true },
        },
        receivedRequests: {
          where: { status: 'accepted' },
          include: { user: true },
        },
      },
    });
  
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
  
    const requestedFriends = user.requestedFriends;
    const receivedFriends = user.receivedRequests;
  
    return [...requestedFriends, ...receivedFriends];
  }
  
   


  async findFriendById(id: number): Promise<Friend> {
    // Cette fonction trouve un ami par son ID
    const friend = await this.prisma.friend.findUnique({ where: { id } });

    if (!friend) {
      throw new NotFoundException('Ami non trouvé.');
    }

    return friend;
  }

  async deleteFriend(id: number, userId: number): Promise<Friend> {
    // Cette fonction supprime un ami par son ID
    const friend = await this.findFriendById(id);

    if (!friend) {
      throw new NotFoundException('Ami non trouvé.');
    }

    if (friend.userId !== userId && friend.friendId !== userId) {
      throw new ForbiddenException('Vous n\'avez pas la permission de supprimer cet ami.');
    }

    await this.prisma.friend.delete({ where: { id } });

    return friend;
  }

  async isFriends(userOneId: number, userTwoId: number): Promise<boolean> {
    // Cette fonction vérifie si deux utilisateurs sont amis
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





  async getFriendsOnline(userId: number): Promise<User[]> {
    try {
      // Récupérez la liste des amis de l'utilisateur avec le statut "accepted".
      const userFriends = await this.prisma.friend.findMany({
        where: {
          userId: userId,
          status: 'accepted',
        },
        select: {
          friend: true,
        },
      });

      // Filtrer la liste des amis en ligne parmi les amis de l'utilisateur.
      const onlineFriends = userFriends.filter((friendship) => {
        return friendship.friend.status === 'ONLINE';
      });

      return onlineFriends.map((friendship) => friendship.friend);
    } catch (error) {
      // Gérez les erreurs ici, par exemple, en lançant une exception ou en journalisant.
      throw new NotFoundException("Aucun ami en ligne trouvé ou erreur lors de la recherche d'amis en ligne.");
    }
  }

}
