// // chat.gateway.module.ts
// import { Module } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';
// import { ChatGatewayService } from './chat-gateway.service';
// import { ChannelService } from './chat.service';
// import { FriendRequestsEvents } from '../friend-request/friends.events';
// import { GatewaySessionManager } from './chat.session'; // Importez la classe qui implémente IGatewaySessionManager

// @Module({
//   imports: [],
//   providers: [
//     ChatGateway,
//     ChatGatewayService,
//     ChannelService,
//     FriendRequestsEvents,
//     {
//       provide: GatewaySessionManager,
//       useClass: GatewaySessionManager, // Utilisez la classe qui implémente l'interface
//     },
//   ],
// })
// export class ChatGatewayModule {}

// chat.gateway.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatGatewayService } from './chat-gateway.service';
import { ChannelService } from './chat.service';
// import { FriendRequestsEvents } from '../friend-request/friends.events';
import { GatewaySessionManager } from './chat.session'; // Importez la classe qui implémente IGatewaySessionManager
import { FriendsModule } from 'src/friends/friends.module';
import { FriendsService } from 'src/friends/friends.service';

@Module({
  imports: [FriendsModule],
  providers: [
    ChatGateway,
    ChatGatewayService,
    ChannelService,
    FriendsService,
    // FriendRequestsEvents,
    GatewaySessionManager, // Assurez-vous que GatewaySessionManager est inclus ici
  ],
})
export class ChatGatewayModule {}
