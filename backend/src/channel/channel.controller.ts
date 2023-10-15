import { Controller, Get, Post, Body, UseGuards, Param, Req, HttpException, HttpStatus, Logger, NotFoundException, Delete } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthUser } from 'src/jwt/auth-user.decorator';
import { ChannelMembership, Message, Player, User } from '@prisma/client';
import { CreateChannelDto, GetChannelDto, JoinChannelDto } from '../dto/channel.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from '@prisma/client';
import { request } from 'express';
import { ChannelSocketDto } from 'src/dto/chat.dto';
import { error } from 'console';
import { ChatGateway } from 'src/chat/chat.gateway';
import { RolesGuard } from './channel.guard';import { PrismaService } from 'prisma/prisma.service';


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












  ////////////////////////////////////////////////////////////////// KICK MUTE CONTROLLER/////////////////////////////////////////////////////////////////////////////////////////
  private async getUserIdByPseudo(pseudo: string): Promise<number> {
    const userId = await this.channelService.findUserIdByPseudo(pseudo);
    if (!userId) throw new NotFoundException(`User with pseudo "${pseudo}" not found.`);
    return userId;
  }

  @Post(':channelId/admin/:pseudo')
  @UseGuards(RolesGuard)
  async setAdmin(@Req() req, @Param('channelId') channelId: string, @Param('pseudo') pseudo: string) {
    const actingUserId = req.userId;
    const targetUserId = await this.getUserIdByPseudo(pseudo);

    try {
      return await this.channelService.setAdmin(actingUserId, targetUserId, channelId);
    } catch (error) {
     return ;
    }
  }

  @Post(':channelId/ban/:pseudo')
  @UseGuards(RolesGuard)
  async banUser(@Req() req, @Param('channelId') channelId: string, @Param('pseudo') pseudo: string) {
    const actingUserId = req.userId;
    const targetUserId = await this.getUserIdByPseudo(pseudo);

    try {
      return await this.channelService.banUser(actingUserId, targetUserId, channelId);
    } catch (error) {
     return ;
    }
  }

  @Post(':channelId/mute/:pseudo')
  @UseGuards(RolesGuard)
  async muteUser(@Req() req, @Param('channelId') channelId: string, @Param('pseudo') pseudo: string) {
    const actingUserId = req.userId;
    const targetUserId = await this.getUserIdByPseudo(pseudo);

    try {
      return await this.channelService.muteUser(actingUserId, targetUserId, channelId, 30);
    } catch (error) {
     return ;
    }
  }

  @Post(':channelId/remove/:pseudo')
  @UseGuards(RolesGuard)
  async removeUser(@Req() req, @Param('channelId') channelId: string, @Param('pseudo') pseudo: string) {
    const actingUserId = req.userId;
    const targetUserId = await this.getUserIdByPseudo(pseudo);

    try {
      return await this.channelService.removeUser(actingUserId, targetUserId, channelId);
    } catch (error) {
      if (error.message.includes('Canal introuvable')) {
        throw new NotFoundException('Channel not found');
      }
     return ;
    }
  }

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


  @Post('join-channel')
  async joinChannel(@Body() joinChannelDto: JoinChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    try {
      const { userId, channelId } = joinChannelDto;

      const updatedUser = await this.channelService.addChannelMembershipToUser(channelId, Number(userId));
      const updatedChannel = await this.channelService.addMemberToChannel(channelId, Number(userId));

      if (!updatedUser || !updatedChannel) {
        throw new NotFoundException('User or channel not found.');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User joined the channel successfully.',
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
      };
    }
  }

  @Post('leave-channel')
  async leaveChannel(@Body() joinChannelDto: JoinChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    try {
      const { userId, channelId } = joinChannelDto;

      const isMemberRemoved = await this.channelService.removeMemberToChannel(channelId, Number(userId));
      const isMembershipRemoved = await this.channelService.removeChannelMembershipToUser(channelId, Number(userId));

      if (!isMemberRemoved || !isMembershipRemoved) {
        throw new NotFoundException('User or channel not found.');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User left the channel successfully.',
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
      };
    }
  }


}