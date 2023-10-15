import { Player, User, Friend } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class FriendsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getFriendsOfUser(userId: number): Promise<({
        player: {
            id: number;
            pseudo: string;
            urlPhotoProfile: string;
            userId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        displayname: string;
        role: import(".prisma/client").$Enums.Role;
        lastname: string;
        firstname: string;
        profileurl: string;
        emails: string;
        phoneNumbers: string;
        photourl: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        urlPhotoProfile: string;
        sessionId: string;
        isProfileUpdated: boolean;
        status: import(".prisma/client").$Enums.UserStatus;
    })[]>;
    getBlockedUsers(userId: number): Promise<User[]>;
    getUsersOnline(): Promise<User[]>;
    getPendingFriends(userId: number): Promise<({
        player: {
            id: number;
            pseudo: string;
            urlPhotoProfile: string;
            userId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        displayname: string;
        role: import(".prisma/client").$Enums.Role;
        lastname: string;
        firstname: string;
        profileurl: string;
        emails: string;
        phoneNumbers: string;
        photourl: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        urlPhotoProfile: string;
        sessionId: string;
        isProfileUpdated: boolean;
        status: import(".prisma/client").$Enums.UserStatus;
    })[]>;
    getFriends(userId: number): Promise<Friend[]>;
    getAcceptedFriends(userId: number): Promise<{
        user: User;
        player: Player;
    }[]>;
    getFriendsOnline(userId: number): Promise<User[]>;
    sendFriendRequest(senderId: number, receiverPseudo: string): Promise<Friend>;
    acceptFriendRequest(userId: number, requesterId: number): Promise<Friend>;
    declineFriendRequest(userId: number, requesterId: number): Promise<Friend>;
    isBlockedByUser(senderId: number, receiverId: number): Promise<boolean>;
    setOnlineStatus(userId: number, online: boolean): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        displayname: string;
        role: import(".prisma/client").$Enums.Role;
        lastname: string;
        firstname: string;
        profileurl: string;
        emails: string;
        phoneNumbers: string;
        photourl: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        urlPhotoProfile: string;
        sessionId: string;
        isProfileUpdated: boolean;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    findFriendById(id: number): Promise<Friend>;
    deleteFriend(id: number, userId: number): Promise<Friend>;
    isFriends(userOneId: number, userTwoId: number): Promise<boolean>;
}
