import { FriendsService } from './friends.service';
import { Friend , Player, User, UserStatus} from '@prisma/client';
import { AuthGuard } from '@nestjs/passport'; // Importez le middleware d'authentification si vous l'utilisez
import { Controller, Post, Patch, Get, Query, Req, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BadRequestException, NotFoundException,  ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from  '../auth/jwt.guard';
import { PlayersService } from 'src/players/players.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SendFriendRequestDto,  FriendRequestIdDto} from  './friends.dto'
import { EventEmitter2 } from '@nestjs/event-emitter';



@Controller('friends') // Remplacez 'friends' par le chemin approprié pour vos routes
export class FriendsController {
    constructor(
      private readonly friendsService: FriendsService,
      private readonly playersService: PlayersService,
      private readonly eventEmitter: EventEmitter2, // Injectez PlayerService
    ) {}


  @UseGuards(JwtAuthGuard)
  @Post('/friend-request')
  async sendFriendRequest(@Req() req, @Body() dto: { receiverPseudo: string }): Promise<any> {
    try {
      const senderId = Number(req.userId);
      const receiver = await this.playersService.getPlayerByPseudo(dto.receiverPseudo); // Supposons que vous ayez une telle méthode
      if (!receiver) {
        throw new HttpException("Joueur non trouvé.", HttpStatus.NOT_FOUND);
      }
  
      if (await this.friendsService.isBlockedByUser(senderId, receiver.id)) {
        throw new HttpException("Vous avez été bloqué par cet utilisateur.", HttpStatus.FORBIDDEN);
      }
  
      const { receiverPseudo } = dto;
      const friendRequest = await this.friendsService.sendFriendRequest(senderId, receiverPseudo);
      this.eventEmitter.emit('friendrequest.create', friendRequest); // Émettez l'événement ici 
      return friendRequest;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Une erreur s'est produite lors de l'envoi de la demande d'ami.", HttpStatus.BAD_REQUEST);
    }
  }
  


  @UseGuards(JwtAuthGuard)
  @Patch('/friend-request/accept')
  async acceptFriendRequest(@Req() req, @Body() dto: { requesterId: number }): Promise<any> {
    try {
      const userId = Number(req.userId);
      const { requesterId } = dto;
      const friend = await this.friendsService.acceptFriendRequest(userId, requesterId);
      this.eventEmitter.emit('friendrequest.accept', friend); // Émettez l'événement ici
      return friend;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Une erreur s'est produite lors de l'acceptation de la demande d'ami.", HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/friend-request/decline')
  async declineFriendRequest(@Req() req, @Body() dto: { requesterId: number }): Promise<any> {
    try {
      const userId = Number(req.userId);
      const { requesterId } = dto;
      const friend = await this.friendsService.declineFriendRequest(userId, requesterId);
      this.eventEmitter.emit('friendrequest.reject', friend); // Émettez l'événement ici
      return friend;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Une erreur s'est produite lors du refus de la demande d'ami.", HttpStatus.BAD_REQUEST);
    }
  }


  @SkipThrottle()
@UseGuards(JwtAuthGuard)
@Get('search-pseudo')
async searchPseudo(@Req() req, @Query('pseudo') pseudoToSearch: string): Promise<Player | null> {
    try {
        const searcherId = Number(req.userId);
        const playerWithPseudo = await this.playersService.getPlayerByPseudo(pseudoToSearch);

        if (!playerWithPseudo) {
            throw new HttpException('Pseudo non trouvé.', HttpStatus.NOT_FOUND);
        }

        // Vérifiez si l'utilisateur actuel est bloqué par l'utilisateur dont le pseudo a été recherché
        if (await this.friendsService.isBlockedByUser(searcherId, playerWithPseudo.userId)) {
            throw new HttpException("Vous avez été bloqué par cet utilisateur.", HttpStatus.FORBIDDEN);
        }

        return playerWithPseudo;
    } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new HttpException("Une erreur inattendue s’est produite.", HttpStatus.BAD_REQUEST);
    }
}


@SkipThrottle()
@UseGuards(JwtAuthGuard)
  @Get('friends')
  async getFriends(@Req() req): Promise<Friend[]> {
    try {
      const userId = Number(req.userId);
      return await this.friendsService.getFriends(userId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Une erreur s'est produite lors de la récupération de la liste d'amis.", HttpStatus.BAD_REQUEST);
    }
  }



  @UseGuards(JwtAuthGuard)
  @Get('users-online')
  async getUsersOnline(): Promise<User[]> {
    try {
      return await this.friendsService.getUsersOnline();
    } catch (error) {
      // Gérez les erreurs ici, par exemple, en lançant une exception ou en journalisant.
      throw new HttpException("Une erreur s'est produite lors de la récupération des utilisateurs en ligne.",  HttpStatus.BAD_REQUEST);
    }
  }




  @UseGuards(JwtAuthGuard)
  @Get('friends-online')
  async getFriendsOnline(@Req() req): Promise<User[]> {
    try {
      // Récupérez l'ID de l'utilisateur à partir de votre JwtAuthGuard, car il le décode
      const userId = req.userId; // Assurez-vous que req est correctement défini

      return await this.friendsService.getFriendsOnline(userId);
    } catch (error) {
      // Gérez les erreurs ici, par exemple, en lançant une exception ou en journalisant.
      throw new HttpException("Une erreur s'est produite lors de la récupération des amis en ligne.",  HttpStatus.BAD_REQUEST);
    }
  }





}


