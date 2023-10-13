import { Module } from '@nestjs/common';
import { ChannelsController } from './channel.controller';
import { ChannelService } from 'src/channel/channel.service';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from 'src/users/users.service';

@Module({imports: [], providers: [CrudService, ChannelService, UsersService, EventEmitter2], controllers: [ChannelsController]})
export class ChannelModule {}
