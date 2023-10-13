import { Controller, Get, Post, Body, UseGuards, Param, Req, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthUser } from 'src/jwt/auth-user.decorator';
import { User } from '@prisma/client';
import { CreateChannelDto } from '../dto/channel.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from '@prisma/client';
import { request } from 'express';


@SkipThrottle()
@Controller('channel')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  private logger: Logger = new Logger('ChannelsController');

  constructor(
    private readonly events: EventEmitter2,
    private readonly channelService: ChannelService
  ) {}

  @Get('test')
  test() {
    this.logger.debug(`TEST SUCCESS ...`);
    return;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createChannel(@Req() req, @Body() createChannelDto: CreateChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    try {
      this.logger.debug(`JE SUIS DANS POST CREATE ${req.user.id}`);
      const channel: Channel = await this.channelService.createChannel(req.user.id,  createChannelDto);
      console.log("Success create channel");
      this.events.emit('channel.create', channel);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Channel created successfully.',
        isSuccess: true
      };
    } catch (error) {
      this.logger.error(`Error dans Post createChannel id : ${req.user.id}  dto: ${createChannelDto.name} ${createChannelDto.type} ${createChannelDto.username} ${createChannelDto.password}`); // Remplace req.id par req.user.id
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
}