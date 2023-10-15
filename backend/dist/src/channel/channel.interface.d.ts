declare enum Role {
    USER = "USER",
    STUDENT = "STUDENT",
    ADMIN = "ADMIN"
}
declare enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    IN_GAME = "IN_GAME"
}
export interface User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    displayname: string;
    role: Role;
    lastname: string;
    firstname: string;
    profileurl: string;
    emails: string;
    phoneNumbers?: string | null;
    photourl?: string | null;
    twoFactorAuthenticationSecret?: string | null;
    isTwoFactorAuthenticationEnabled: boolean;
    ownedChannels: Channel[];
    channels: ChannelMembership[];
    messages: Message[];
    player?: Player | null;
    urlPhotoProfile?: string | null;
    sessionId?: string | null;
    isProfileUpdated: boolean;
    status: UserStatus;
    requestedFriends: Friend[];
    receivedRequests: Friend[];
}
export interface Channel {
    id: string;
    name: string;
    type: string;
    password?: string | null;
    createdAt: Date;
    ownerId: number;
    owner: User;
    messages: Message[];
    members: ChannelMembership[];
}
export interface Message {
    id: string;
    content: string;
    createdAt: Date;
    channelId: string;
    channel: Channel;
    userId: number;
    user: User;
}
export interface ChannelMembership {
    id: number;
    userId: number;
    channelId: string;
    user: User;
    channel: Channel;
}
export interface Match {
    id: number;
    playerAId: number;
    playerBId: number;
    scoreA: number;
    scoreB: number;
    playedAt: Date;
    playerA: Player;
    playerB: Player;
}
export interface Player {
    id: number;
    pseudo?: string | null;
    urlPhotoProfile?: string | null;
    matchesA: Match[];
    matchesB: Match[];
    userId: number;
    user: User;
}
export interface Friend {
    id: number;
    userId: number;
    friendId: number;
    status: string;
    user: User;
    friend: User;
}
export interface AccessParams {
    id: string;
    userId: number;
}
export interface CreatechannelParams {
    creator: User;
    username: string;
    message: string;
    params: {
        username: string;
        message: string;
    };
}
export interface GetchannelMessagesParams {
    id: string;
    limit: number;
}
export interface UpdatechannelParams {
    id: string;
    lastMessageSent: Date;
}
export interface IChannelsService {
    getchannels(id: number): Promise<Channel[]>;
    findById(id: string): Promise<Channel | null>;
    isCreated(userId: number, recipientId: number): Promise<Channel | null>;
    createchannel(creator: any, params: CreatechannelParams): Promise<Channel>;
    hasAccess(params: AccessParams): Promise<boolean>;
    save(channel: any): Promise<Channel>;
    getMessages(params: GetchannelMessagesParams): Promise<Channel | null>;
    update(params: UpdatechannelParams): Promise<void>;
}
export {};
