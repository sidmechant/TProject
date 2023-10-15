import { ChannelService } from './chat.service';
import { UpdateChannelDto, SearchChannelByNameDto } from './chat.dto';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';
import { CreateChannelDto } from 'src/dto/channel.dto';
export declare class ChannelController {
    private readonly channelService;
    private readonly crud;
    constructor(channelService: ChannelService, crud: CrudService);
    createChannel(createChannelDto: CreateChannelDto, req: any): Promise<{
        statusCode: number;
        message: string;
        isSuccess: boolean;
    }>;
    findChannelByName(searchChannelDto: SearchChannelByNameDto): Promise<any>;
    getChannelsByUser(req: any): Promise<any>;
    findAll(): Promise<any>;
    updateChannel(req: any, updateChannelDto: UpdateChannelDto): Promise<any>;
    deleteChannelByName(request: any): Promise<any>;
    deleteAllUserChannels(request: any): Promise<any>;
}
