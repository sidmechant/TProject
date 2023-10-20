import { Module } from '@nestjs/common';
import { ChannelsController } from './channel.controller';
import { ChannelService } from 'src/channel/channel.service';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from 'src/users/users.service';
import { GatewaySessionManager } from 'src/chat/chat.session';
import { FriendsService } from 'src/friends/friends.service';
import { MessageService } from 'src/message/message.service';
import { SocketModule } from 'src/socket/socket.module';
import { ChatGatewayModule } from 'src/chat/chat.gateway.module';

@Module({imports: [SocketModule, ChatGatewayModule], providers: [MessageService, FriendsService, GatewaySessionManager, CrudService, ChannelService, UsersService, EventEmitter2], controllers: [ChannelsController]})
export class ChannelModule {}
