import { CreateChannelDto, UpdateChannelDto } from '../dto/channel.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Channel } from '@prisma/client';
export declare class ChannelService {
    private readonly prisma;
    readonly ALGORITHM = "aes-192-cbc";
    private readonly KEY_LENGTH;
    private readonly IV_LENGTH;
    private readonly PASSWORD;
    private key;
    constructor(prisma: PrismaService);
    encrypt(text: string): string;
    decrypt(text: string): string;
    private hashPassword;
    private checkPassword;
    findChannelByname(name: string, userId: number): Promise<{
        id: string;
        name: string;
        type: string;
        password: string;
        createdAt: Date;
        ownerId: number;
    }>;
    createChannel(createChannelDto: CreateChannelDto): Promise<Channel>;
    findChannelByName(name: string): Promise<Channel | null>;
    findAllChannels(): Promise<Channel[]>;
    findChannelsByUserId(userId: number): Promise<Channel[]>;
    getChannelsByUserId(userId: number): Promise<Channel[]>;
    diffChannel(channel: any, newChannel: UpdateChannelDto): boolean;
    updatePassword(channel: UpdateChannelDto, password: string, type: string): string;
    updateType(channel: UpdateChannelDto, type: string): string;
    updateChannel(channel: any, newchannelDto: UpdateChannelDto): Channel;
    updateChannelByUserId(userId: number, data: UpdateChannelDto): Promise<Channel>;
    deleteChannelByNameAndOwnerId(name: string, userId: number): Promise<void>;
    deleteAllChannelsByOwnerId(userId: number): Promise<void>;
}
