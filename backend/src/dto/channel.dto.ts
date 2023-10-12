export class CreateChannelDto {
    name: string;
    type: 'public' | 'private' | 'protected';
    ownerId: number;
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