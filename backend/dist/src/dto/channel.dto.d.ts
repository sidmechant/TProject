export declare class CreateChannelDto {
    name: string;
    username: string;
    type: 'public' | 'private' | 'protected';
    ownerId?: number;
    password?: string;
}
export declare class UpdateChannelDto {
    newname: string;
    name: string;
    ownerId: number;
    newownerId: number;
    password?: string;
    newpassword?: string;
    newtype: 'public' | 'private' | 'protected ';
}
export declare class SearchChannelByNameDto {
    name: string;
}
export declare class UpdateChannelByNameDto {
    currentName: string;
    updateData: UpdateChannelDto;
}
export declare class GetChannelDto {
    name?: string;
    readonly channelId?: string;
    readonly password?: string;
    userId: string;
    ownerId?: string;
}
export declare class CreateMessageDto {
    readonly content: string;
    readonly channelId: string;
    readonly channelName?: string;
    userId: string;
    readonly recepient?: string;
}
export declare class JoinChannelDto {
    userId: string;
    channelId: string;
}
