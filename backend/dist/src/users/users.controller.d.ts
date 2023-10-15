import { UsersService } from './users.service';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyUSer({ id }: {
        id: number;
    }, req: Request): Promise<{
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
    }>;
    getUsers(): Promise<{
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
    }[]>;
    ClearUsers(): Promise<void>;
    GetMyUserbypseudo(): void;
}
