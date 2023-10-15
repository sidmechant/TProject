import { FriendsService } from './friends.service';
import { Friend, Player, User } from '@prisma/client';
import { PlayersService } from 'src/players/players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class FriendsController {
    private readonly friendsService;
    private readonly playersService;
    private readonly eventEmitter;
    constructor(friendsService: FriendsService, playersService: PlayersService, eventEmitter: EventEmitter2);
    sendFriendRequest(req: any, dto: {
        receiverPseudo: string;
    }): Promise<any>;
    acceptFriendRequest(req: any, dto: {
        requesterId: number;
    }): Promise<any>;
    declineFriendRequest(req: any, dto: {
        requesterId: number;
    }): Promise<any>;
    searchPseudo(req: any, pseudoToSearch: string): Promise<Player | null>;
    getFriends(req: any): Promise<Friend[]>;
    getUsersOnline(): Promise<User[]>;
    getFriendsOnline(req: any): Promise<User[]>;
    getFriendlist(req: any): Promise<({
        status: string;
        player: {
            id: number;
            pseudo: string;
            urlPhotoProfile: string;
            userId: number;
        };
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
    } | {
        status: string;
        user: {
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
        };
        player: {
            id: number;
            pseudo: string;
            urlPhotoProfile: string;
            userId: number;
        };
    })[]>;
    getPendingFriends(req: any): Promise<({
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
    getAcceptedFriends(req: any): Promise<{
        user: {
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
        };
        player: {
            id: number;
            pseudo: string;
            urlPhotoProfile: string;
            userId: number;
        };
    }[]>;
    getBlockedUsers(req: any): Promise<User[]>;
}
