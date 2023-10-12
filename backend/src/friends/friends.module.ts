import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PlayersService } from 'src/players/players.service';
import { CrudService } from 'src/auth/forty-twoapi/crud.service';

@Module({
  providers: [FriendsService, PlayersService, CrudService],
  controllers: [FriendsController],
})
export class FriendsModule {}
