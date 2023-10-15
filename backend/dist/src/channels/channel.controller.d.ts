import { ChannelService } from './channel.service';
import { CreateChannelDto, UpdateChannelDto, SearchChannelByNameDto } from '../dto/channel.dto';
import { ChatGateway } from 'src/chat/chat.gateway';
export declare class ChannelController {
    private readonly channelService;
    private readonly chatgateway;
    private readonly logger;
    constructor(channelService: ChannelService, chatgateway: ChatGateway);
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    findChannelByName(searchChannelDto: SearchChannelByNameDto): Promise<any>;
    findAll(): Promise<any>;
    updateChannel(userId: string, req: any, updateChannelDto: UpdateChannelDto): Promise<any>;
    getChannelsByUser(userId: string, request: any): Promise<any>;
    getMissingChannels(userId: string, request: any): Promise<any>;
    deleteChannelByName(request: any): Promise<any>;
    deleteAllUserChannels(request: any): Promise<any>;
}
