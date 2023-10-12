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
import { FriendRequestsEvents } from '../friend-request/friends.events';
import { GatewaySessionManager } from './chat.session'; // Importez la classe qui implémente IGatewaySessionManager

@Module({
  imports: [],
  providers: [
    ChatGateway,
    ChatGatewayService,
    ChannelService,
    FriendRequestsEvents,
    GatewaySessionManager, // Assurez-vous que GatewaySessionManager est inclus ici
  ],
})
export class ChatGatewayModule {}
