import { HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetMessageDto } from './dto/get-message.dto';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UsersService } from 'src/users/users.service';
import { MessageSocketDto } from 'src/dto/chat.dto';
export declare class MessageController {
    private readonly messageService;
    private readonly chatGateway;
    private readonly userService;
    private eventEmitter;
    constructor(messageService: MessageService, chatGateway: ChatGateway, userService: UsersService, eventEmitter: EventEmitter2);
    createMessage(req: any, createMessageDto: CreateMessageDto): Promise<{
        status: HttpStatus;
        message: MessageSocketDto;
        isSuccess: boolean;
    } | {
        status: HttpStatus;
        message: string;
        isSuccess?: undefined;
    }>;
    findAllMessagesChannel(req: any, getMessageDto: GetMessageDto): Promise<{
        status: HttpStatus;
        message: {
            id: string;
            content: string;
            createdAt: Date;
            channelId: string;
            userId: number;
        }[];
        isSuccess: boolean;
    } | {
        status: HttpStatus;
        message: string;
        isSuccess?: undefined;
    }>;
    findAllMessages(req: any): Promise<{
        status: HttpStatus;
        message: {
            id: string;
            content: string;
            createdAt: Date;
            channelId: string;
            userId: number;
        }[];
        isSuccess: boolean;
    } | {
        status: HttpStatus;
        message: string;
        isSuccess?: undefined;
    }>;
    findOneMessage(req: any, getMessageDto: GetMessageDto): Promise<{
        status: HttpStatus;
        message: {
            id: string;
            content: string;
            createdAt: Date;
            channelId: string;
            userId: number;
        };
        isSuccess: boolean;
    } | {
        status: HttpStatus;
        message: string;
        isSuccess?: undefined;
    }>;
    updateMessage(req: any, updateMessageDto: UpdateMessageDto): Promise<{
        status: HttpStatus;
        message: {
            id: string;
            content: string;
            createdAt: Date;
            channelId: string;
            userId: number;
        };
        isSuccess: boolean;
    } | {
        status: HttpStatus;
        message: string;
        isSuccess?: undefined;
    }>;
    remove(req: any, updateMessageDto: UpdateMessageDto): Promise<{
        status: HttpStatus;
        message: string;
    } | {
        status: string;
        message: string;
    }>;
}
