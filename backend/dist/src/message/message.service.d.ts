import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ChannelService } from 'src/channel/channel.service';
export declare class MessageService {
    private readonly prisma;
    private readonly channelService;
    constructor(prisma: PrismaService, channelService: ChannelService);
    findChannelById(id: string): Promise<boolean>;
    create(createMessageDto: CreateMessageDto): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        channelId: string;
        userId: number;
    }>;
    findMessageByMessageId(messageId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        channelId: string;
        userId: number;
    }>;
    findAllMessageBychannelId(channelId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        channelId: string;
        userId: number;
    }[]>;
    findAllMessageByUserId(userId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        channelId: string;
        userId: number;
    }[]>;
    updateMessageByMessageIdUserID(userId: string, updateMessageDto: UpdateMessageDto): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        channelId: string;
        userId: number;
    }>;
    removeMessageByMessageID(messageId: string): Promise<{
        message: string;
    }>;
}
