import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Player, User, Friend, UserStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}
  async getFriendsOfUser(userId: number) {
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


  async getBlockedUsers(userId: number): Promise<User[]> {
    const blockedRelations = await this.prisma.friend.findMany({
      where: { userId: userId, status: 'blocked' },
      select: { friend: { include: { player: true } } }
    });
    return blockedRelations.map(relation => relation.friend);
  }

  async getUsersOnline(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { status: "ONLINE" },
      include: { player: true }
    });
  }

  async getPendingFriends(userId: number) {
    const pendingRequests = await this.prisma.friend.findMany({
        where: { friendId: userId, status: "requested" },
        select: { user: { include: { player: true } } }
    });
  
    return pendingRequests.map(f => f.user);
  }
  
  async getFriends(userId: number): Promise<Friend[]> {
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
      throw new NotFoundException('Utilisateur non trouvé.');
    }
  
    const requestedFriends = user.requestedFriends;
    const receivedFriends = user.receivedRequests;
  
    return [...requestedFriends, ...receivedFriends];
  }


  async getAcceptedFriends(userId: number): Promise<{ user: User, player: Player }[]> {
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
  
    // Extraire la liste des amis acceptés et leurs pseudos associés
    const acceptedFriendsWithPseudo: { user: User, player: Player }[] = [];
  
    for (const friendship of acceptedFriendships) {
      if (friendship.userId === userId) {
        acceptedFriendsWithPseudo.push({ user: friendship.friend, player: friendship.friend.player });
      } else {
        acceptedFriendsWithPseudo.push({ user: friendship.user, player: friendship.user.player });
      }
    }
  
    return acceptedFriendsWithPseudo;
  }



  async getFriendsOnline(userId: number): Promise<User[]> {

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
  
    // Filtrez la liste des amis pour ne conserver que ceux qui sont en ligne
    const onlineFriends = allFriends.filter(friend => friend.status === "ONLINE");
  
    return onlineFriends;
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

    return await this.prisma.friend.delete({
      where: {
        id: friendRequest.id,
      }
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


  
  async setOnlineStatus(userId: number, online: boolean) {
    const status = online ? 'ONLINE' : 'OFFLINE';
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status }
    });
  }


  async findFriendById(id: number): Promise<Friend> {

    console.log("id = ", id);
    const friend = await this.prisma.friend.findUnique({
      where: {
        id: id, // Correctly passing id as a regular number
      },
    });
  
    if (!friend) {
      throw new NotFoundException('Ami non trouvé.');
    }
  
    return friend;
  }
  
  
  async deleteFriend(id_first: number, id_second: number): Promise<Friend> {
    const friend = await this.prisma.friend.findFirst({
      where: {
        OR: [
          {
            userId: id_first,
            friendId: id_second,
          },
          {
            userId: id_second,
            friendId: id_first,
          },
        ],
      },
    });

    if (!friend) {
      throw new NotFoundException('Friend relation not found');
    }

    return this.prisma.friend.delete({
      where: {
        id: friend.id,
      },
    });
  }
  

  async isFriends(userOneId: number, userTwoId: number): Promise<boolean> {
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

}
