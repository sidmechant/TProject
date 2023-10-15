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
