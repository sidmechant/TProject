import { ChannelMembership, Message, Player } from '@prisma/client';
import { CreateChannelDto, CreateMessageDto, GetChannelDto, JoinChannelDto } from '../dto/channel.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from '@prisma/client';
import { ChatGateway } from 'src/chat/chat.gateway';
import { PrismaService } from 'prisma/prisma.service';
export declare class ChannelsController {
    private readonly events;
    private readonly channelService;
    private readonly chatGateway;
    private readonly prisma;
    private logger;
    constructor(events: EventEmitter2, channelService: ChannelService, chatGateway: ChatGateway, prisma: PrismaService);
    test(): void;
    createChannel(req: any, createChannelDto: CreateChannelDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    addMemberToChannel(getChannelDto: GetChannelDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    removeMemberFromChannel(getChannelDto: GetChannelDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    listMembersByChannelId(getChannelDto: GetChannelDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
        members: ChannelMembership[];
    }>;
    listMessageByChannelId(getChannelDto: GetChannelDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
        messages: Message[];
    }>;
    addMessageToChannel(getChannelDto: GetChannelDto, content: string): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    getAllUserChannelWithMembers(req: any): Promise<{
        channelId: string;
        channelName: string;
        ownerId: number;
        players: Player[];
    }[]>;
    joinChannel(joinChannelDto: JoinChannelDto): Promise<boolean>;
    leaveChannel(joinChannelDto: JoinChannelDto): Promise<boolean>;
    getAvailableChannels(req: any): Promise<Channel[] | null>;
    sendMessage(req: any, createMessageDto: CreateMessageDto): Promise<Message[] | null>;
}
