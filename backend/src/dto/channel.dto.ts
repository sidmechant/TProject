import { IsEmpty, IsString, isEmpty } from "class-validator";
export class CreateChannelDto {
    @IsString()
    @IsEmpty()
    name: string;

    @IsString()
    @IsEmpty()
    username: string;

    @IsEmpty()
    @IsString()
    type: 'public' | 'private' | 'protected';

    ownerId: number;

    @IsString()
    password?: string;
}

export class UpdateChannelDto {
    newname: string;
    name: string;
    ownerId: number;
    newownerId: number;
    password?: string;
    newpassword?: string;
    newtype: 'public' | 'private' | 'protected ';
}

export class SearchChannelByNameDto {
    name: string;
}

export class UpdateChannelByNameDto {
  currentName: string; // Nom actuel du canal
  updateData: UpdateChannelDto; // Données pour mettre à jour
}

export class GetChannelDto {
    @IsString()
    name?: string;

    @IsString()
    readonly channelId?: string;
    
    @IsString()
    readonly password?: string;
    
    @IsString()
    userid: string;

    @IsString()
    ownerId?: string;
}