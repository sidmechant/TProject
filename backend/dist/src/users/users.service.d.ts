import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';
import { UserSocketDto } from 'src/dto/chat.dto';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyUsers(id: number, req: Request): Promise<{
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
    getUserIdByUsername(username: string): Promise<number | null>;
    getUserSocketDtoByUsername(username: string): Promise<UserSocketDto | null>;
    getUserSocketDtoByUserId(userId: string): Promise<UserSocketDto | null>;
    GetInfoUser(): Promise<{
        id: number;
    }[]>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<{
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
    clearAllUsers(): Promise<void>;
    getUserSocketDtoByUser(user: User): Promise<UserSocketDto | null>;
    ifUserExistsByUserId(userId: number): Promise<boolean>;
}
