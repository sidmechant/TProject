
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatGatewayService } from './chat-gateway.service';
import { ChannelService } from './chat.service';
import { GatewaySessionManager } from './chat.session';
import { FriendsModule } from 'src/friends/friends.module';
import { FriendsService } from 'src/friends/friends.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageService } from 'src/message/message.service';
import { ChannelService } from 'src/channel/channel.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [FriendsModule],
  providers: [
    UsersService,
    MessageService,
    ChatGateway,
    ChatGatewayService,
    ChannelService,
    FriendsService,
    GatewaySessionManager,
    EventEmitter2,
  ],
})
export class ChatGatewayModule {}
