import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Request,
  HttpStatus,
  HttpException,
  Res
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetMessageDto } from './dto/get-message.dto';
import { error } from 'console';
import { ChatGateway } from 'src/chat/chat.gateway';

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
    private eventEmitter: EventEmitter2
  ) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'attachments',
        maxCount: 5,
      },
    ]),
  )

  @Post('create')
  async createMessage(@Req() req,@Body() createMessageDto: CreateMessageDto) {
    try {
      createMessageDto.userId = req.user.id;
      const message = await this.messageService.create(createMessageDto);
      if (!message) throw new error();

      const messageSocketDto = { author: req.user, recipient: req.userRecipent, message: message };
      this.chatGateway.handleMessageCreateEvent(messageSocketDto);
    
      return { status: HttpStatus.OK, message: message, isSuccess: true };
    } catch (error) {
      return { status: HttpStatus.NOT_IMPLEMENTED, message: `Failed to create a new message. ${error.message}` };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('allMessagesChannel')
  async findAllMessagesChannel(@Req() req, @Body() getMessageDto: GetMessageDto) {
    try {
      const messages = await this.messageService.findAllMessageBychannelId(getMessageDto.channelId);
      if (!messages) throw new error();
      
      const messageSocketDto = { author: req.user, recipient: req.userRecipent, messages: messages };
      this.chatGateway.handleMessageCreateEvent(messageSocketDto);
  
      return { status: HttpStatus.OK, message: messages, isSuccess: true };
    } catch (error) {
      return { status: HttpStatus.NOT_FOUND, message: `Failed to retrieve messages. ${error.message}` };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('myMessages')
  async findAllMessages(@Req() req) {
    const id: string = req.user.id;
    try {
      const messages = await this.messageService.findAllMessageByUserId(id);
      if (!messages) throw new error();

      const messageSocketDto = { author: req.user, recipient: req.userRecipent, messages: messages };
      this.chatGateway.handleMessageCreateEvent(messageSocketDto);
      
      return { status: HttpStatus.OK, message: messages, isSuccess: true };
    } catch (error) {
      return { status: HttpStatus.NOT_FOUND, message: `Failed to retrieve the message. ${error.message}` };
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('myMessage')
  async findOneMessage(@Req() req, @Body() getMessageDto: GetMessageDto) {
    try {
      const messages = await this.messageService.findMessageByMessageId(getMessageDto.messageId);
      if (!messages) throw new error();

      const messageSocketDto = { author: req.user, recipient: req.userRecipent, message: messages };
      this.chatGateway.handleMessageCreateEvent(messageSocketDto);
      
      return { status: HttpStatus.OK, message: messages, isSuccess: true };
    } catch (error) {
      return { status: HttpStatus.NOT_FOUND, message: `Failed to retrieve the message. ${error.message}` };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateMessage')
  async updateMessage(@Req() req, @Body() updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.messageService.updateMessageByMessageIdUserID(req.user.id, updateMessageDto);
      if (!message) throw new error();


      const messageSocketDto = { author: req.user, recipient: req.userRecipent, message: message };
      this.chatGateway.handleMessageUpdate(messageSocketDto);

      return { status: HttpStatus.OK, message: message, isSuccess: true };
    } catch (error) {
      return { status: HttpStatus.NOT_MODIFIED, message: `Failed to update the message. Error ${error.message}`};
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async remove(@Req() req, @Body() updateMessageDto: UpdateMessageDto) {
    try {
      await this.messageService.removeMessageByMessageID(updateMessageDto.messageId);

      const messageSocketDto = { author: req.user, recipient: req.userRecipent};
      this.chatGateway.handleMessageUpdate(messageSocketDto);

      return { status: HttpStatus.OK, message: 'Message deleted successfully.' };
    } catch (error) {
      return { status: 'error', message: `Failed to delete the message. Error: ${error.message}` };
    }
  }
}