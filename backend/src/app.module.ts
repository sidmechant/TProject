import { Module , forwardRef} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module'
import { UsersModule } from './users/users.module';
import { PlayersModule } from './players/players.module';
import {GameModule} from './game/game.module';
import { APP_GUARD } from '@nestjs/core';
import { TwoFactorAuthenticationGuard } from 'src/auth/2faGuard/TwoFactorAuthenticationGuard'
import { CrudService } from './auth/forty-twoapi/crud.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { ChatGateway } from './chat/chat.gateway';
import { ChatGatewayModule } from './chat/chat.gateway.module';
import { ChannelModule } from './channel/channel.module';
import { FriendsModule } from 'src/friends/friends.module'
import { EventsModule } from './friend-request/friends-module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, PlayersModule, GameModule, ChannelModule, FriendsModule, ChatGatewayModule, EventsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Mettez JwtAuthGuard en premier
    },
    {
      provide: APP_GUARD,
      useClass: TwoFactorAuthenticationGuard,
    },
    CrudService, // Assurez-vous d'inclure votre service Crud ici
  ],
})
export class AppModule {}
