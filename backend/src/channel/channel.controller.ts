import { Controller, Get, Post, Body, UseGuards, Param, Req, HttpException, HttpStatus, Logger, NotFoundException, Delete, Patch } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthUser } from 'src/jwt/auth-user.decorator';
import { ChannelMembership, Message, Player, User } from '@prisma/client';
import { CreateChannelDto, CreateMessageDto, GetChannelDto, JoinChannelDto } from '../dto/channel.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from '@prisma/client';
import { request } from 'express';
import { ChannelSocketDto } from 'src/dto/chat.dto';
import { error } from 'console';
import { ChatGateway } from 'src/chat/chat.gateway';
import { PrismaService } from 'prisma/prisma.service';
import { centroid } from 'math/vec2';


@SkipThrottle()
@Controller('channel')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  private logger: Logger = new Logger('ChannelsController');

  constructor(
    private readonly events: EventEmitter2,
    private readonly channelService: ChannelService,
    private readonly chatGateway: ChatGateway,
    private readonly prisma: PrismaService
  ) { }

  @Get('test')
  test() {
    this.logger.log(`TEST SUCCESS ...`);
    this.chatGateway.handletest(null);
    return;
  }

  @Post('created-channel')
  async createChannel(@Req() req, @Body() createChannelDto: CreateChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    this.logger.debug(`EntryPoint begin try ${createChannelDto}`);
    try {
      this.logger.debug(`entryPoint`);
      createChannelDto.ownerId = Number(req.userId);
      this.logger.debug(`DATA name:
        ${createChannelDto.name}
        ownerId: ${createChannelDto.ownerId}
        password: ${createChannelDto.password}
        type: ${createChannelDto.type}
        username ${createChannelDto.username}`);

      const newChannel: Channel | null = await this.channelService.createChannel(createChannelDto);
      if (!newChannel)
        throw error();
      this.logger.debug(`Channel created ${newChannel}`);

      const channelSocketDto: ChannelSocketDto = await this.channelService.getChannelSocketDtoByChannel(newChannel);
      if (!channelSocketDto)
        throw new NotFoundException(`Channel ${channelSocketDto.channel.name} not found`);

      this.logger.debug(`begin event ${channelSocketDto}`);
      this.chatGateway.handleChannelCreate(channelSocketDto);
      this.logger.debug(`EndPoint ${channelSocketDto}`);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Channel created successfully.',
        isSuccess: true
      };
    } catch (error) {
      this.logger.error(`Error ${error.message}`);
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        isSuccess: false
      }
    }
  }

  @Post('add-member-channel')
  async addMemberToChannel(@Body() getChannelDto: GetChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    try {
      const channelId = getChannelDto.channelId;
      const userId = Number(getChannelDto.userId);

      const updatedChannel = await this.channelService.addMemberToChannel(channelId, userId);
      if (!updatedChannel)
        throw new NotFoundException('Channel not found.');

      return {
        statusCode: HttpStatus.OK,
        message: 'Member added to the channel successfully.',
        isSuccess: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        isSuccess: false
      }
    }
  }

  @Delete('remove-member-channel')
  async removeMemberFromChannel(@Body() getChannelDto: GetChannelDto): Promise<{ statusCode: number; message: string; isSuccess: boolean }> {
    try {
      const { channelId, userId } = getChannelDto;

      const updatedChannel = await this.channelService.removeMemberFromChannel(channelId, Number(userId));
      if (!updatedChannel)
        throw new NotFoundException('Channel or member not found.');

      return {
        statusCode: HttpStatus.OK,
        message: 'Member removed from the channel successfully.',
        isSuccess: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        isSuccess: false
      }
    }
  }

  @Get('list-members-channel')
  async listMembersByChannelId(getChannelDto: GetChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean, members: ChannelMembership[] }> {
    try {
      const members = await this.channelService.listMembersByChannelId(getChannelDto.channelId);
      if (!members)
        throw new NotFoundException('Channel not found.');

      return {
        statusCode: HttpStatus.OK,
        message: 'Members listed successfully.',
        isSuccess: true,
        members,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false,
          members: [],
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        isSuccess: false,
        members: [],
      }
    }
  }

  @Get('list-message-channel')
  async listMessageByChannelId(getChannelDto: GetChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean, messages: Message[] }> {
    try {
      const messages = await this.channelService.listMessageByChannelId(getChannelDto.channelId);
      if (!messages)
        throw new NotFoundException('Channel not found');

      return {
        statusCode: HttpStatus.OK,
        message: 'Members listed successfully.',
        isSuccess: true,
        messages: messages,
      };

    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false,
          messages: [],
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        isSuccess: false,
        messages: [],
      }
    }
  }

  @Post('add-message-channel')
  async addMessageToChannel(@Body() getChannelDto: GetChannelDto, @Body('content') content: string): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    try {
      const channelId = getChannelDto.channelId;
      const userId = Number(getChannelDto.userId);

      const updatedChannel = await this.channelService.addMessageToChannel(channelId, userId, content);
      if (!updatedChannel)
        throw new NotFoundException('Channel not found.');

      return {
        statusCode: HttpStatus.OK,
        message: 'Message added to the channel successfully.',
        isSuccess: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        isSuccess: false
      }
    }
  }

  /*
    socket.emit('newMessage, message);
      message: {
        senderId,
        content,
        createdAt,
        channelId
      }
    */

  @Get('all_from_id')
  async getAllUserChannelWithMembers(@Req() req): Promise<{ channelId: string, channelName: string, ownerId: number, players: Player[] }[]> {
    try {
      const channels = await this.prisma.channel.findMany({
        where: {
          members: {
            some: {
              userId: Number(req.userId),
            },
          },
        },
        include: {
          members: {
            select: {
              user: {
                select: {
                  player: true
                }
              }
            }
          }
        }
      });

      const formattedChannels = channels.map(channel => {
        return {
          channelId: channel.id,
          channelName: channel.name,
          ownerId: channel.ownerId,
          players: channel.members.map(member => member.user.player).filter(player => player) // Filter out any null/undefined players
        };
      });

      return formattedChannels;
    } catch (error) {
      if (error instanceof HttpException) {
        return null;
      }
    }
  }

  @Patch('join-channel')
  async joinChannel(@Body() joinChannelDto: JoinChannelDto): Promise<boolean> {
    try {
      const { userId, channelId } = joinChannelDto;

      //const updatedUser = await this.channelService.addChannelMembershipToUser(channelId, Number(userId));
      const updatedChannel = await this.channelService.addMemberToChannel(channelId, Number(userId));

      if (!updatedChannel) {
        throw new NotFoundException('User or channel not found.');
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  @Patch('join-channel-protected')
  async joinChannelProtected(@Body() joinChannelDto: JoinChannelDto): Promise<boolean> {
    try {
      const { userId, channelId, password } = joinChannelDto;

      //const updatedUser = await this.channelService.addChannelMembershipToUser(channelId, Number(userId));
      const updatedChannel = await this.channelService.addMemberToChannel(channelId, Number(userId), password);

      if (!updatedChannel) {
        throw new NotFoundException('User or channel not found.');
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  @Post('leave-channel')
  async leaveChannel(@Body() joinChannelDto: JoinChannelDto): Promise<boolean> {
    try {
      const { userId, channelId } = joinChannelDto;

      //const isMemberRemoved = await this.channelService.removeMemberToChannel(channelId, Number(userId));
      const isMembershipRemoved = await this.channelService.removeChannelMembershipToUser(channelId, Number(userId));

      if (!isMembershipRemoved) {
        throw new NotFoundException('User or channel not found.');
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  @Get('available-channels')
  async getAvailableChannels(@Req() req): Promise<Channel[] | null> {
      try {
          const userId = Number(req.userId); 
          const channels = await this.channelService.getAvailableChannelsForUser(userId);
          if (!channels || channels.length === 0) {
            throw new Error();
          }
          return channels;   
      } catch (error) {
        return null;
      }
  }

  @Post('send-message')
  async sendMessage(@Req() req, @Body() createMessageDto: CreateMessageDto): Promise<Message[] | null> {
    try {
      createMessageDto.userId = req.userId;
      if (!createMessageDto.userId)
        throw new NotFoundException('User not found');
  
      const updatedMessages = await this.channelService.addMessageInChannel(createMessageDto);
      const message: string = updatedMessages[updatedMessages.length - 1].content
      this.chatGateway.handleMessageSend(createMessageDto.channelName, message);
      return updatedMessages || null;
    } catch (error) {
      return null;
    }
  }
  

}