interface User {
    id: number,
    pseudo: string,
    urlPhotoProfile: string,
}

interface CreateChannelDto {
    name: string,
    type: string,
    password?: string,
}