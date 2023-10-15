import { Channel, Message, User } from '@prisma/client';
export declare class UserSocketDto {
    id: number;
    username: string;
    displayname: string;
    role: string;
    user: User;
}
export declare class MessageSocketDto {
    message?: Message;
    messages?: Message[];
    author: UserSocketDto;
    recipient: UserSocketDto;
}
export declare class ChannelSocketDto {
    creator: UserSocketDto;
    recipient?: UserSocketDto;
    lastMessageSent?: MessageSocketDto;
    channel: Channel;
}
