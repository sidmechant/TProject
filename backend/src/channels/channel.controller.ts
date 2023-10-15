import {
  Post,
  Get,
  Put,
  Body,
  Req,
  Delete,
  Controller,
  HttpCode,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Param, 
  Logger,
  UseGuards} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto, UpdateChannelDto, SearchChannelByNameDto, UpdateChannelByNameDto } from '../dto/channel.dto';
import { PrismaClient, Channel } from '@prisma/client';
import { error } from 'console';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelSocketDto } from 'src/dto/chat.dto';
import { channel } from 'diagnostics_channel';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelController {
  private readonly logger: Logger = new Logger('ChannelController');

  constructor(private readonly channelService: ChannelService, private readonly chatgateway: ChatGateway) { }

  /**
   * Crée un nouveau canal.
   * 
   * @route POST /created
   * @group Channels - Opérations concernant les canaux.
   * @param {CreateChannelDto} createChannelDto.body.required - Les données du canal à créer.
   * @returns {Promise<{ statusCode: number, message: string, isSuccess: boolean }>} 201 - Indique que le canal a été créé avec succès.
   * @returns {Promise<{ statusCode: number, message: string, isSuccess: boolean }>} 401 - Indique que l'utilisateur n'est pas autorisé à créer un canal.
   * @returns {Promise<{ statusCode: number, message: string, isSuccess: boolean }>} 400 - Indique une erreur lors de la création du canal.
   * */
  @Post('created')
  async createChannel(@Body() createChannelDto: CreateChannelDto): Promise<{ statusCode: number, message: string, isSuccess: boolean }> {
    this.logger.debug(`EntryPoint begin try ${createChannelDto}`);
    console.log("ICI");
    try {
      this.logger.debug(`entryPoint`);
      const newChannel: Channel | null = await this.channelService.createChannel(createChannelDto);
      if (!newChannel)
        throw error();      
      this.logger.debug(`Channel created ${newChannel}`);

      const channelSocketDto: ChannelSocketDto = await this.channelService.getChannelSocketDtoByChannel(newChannel);
      if (!channelSocketDto)
        throw new NotFoundException(`Channel ${channelSocketDto.channel.name} not found`);

      this.logger.debug(`begin event ${channelSocketDto}`);
      this.chatgateway.handleChannelCreate(channelSocketDto);
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

  /**
   * Cherche un canal par son nom.
   * 
   * @route POST /canaux/search
   * @param {SearchChannelByNameDto} searchChannelDto - DTO contenant le nom du canal.
   * @returns {Promise<any>} - Le canal trouvé ou une réponse d'erreur.
   */
  @Post('search')
  async findChannelByName(@Body() searchChannelDto: SearchChannelByNameDto): Promise<any> {
    try {
      const channel = await this.channelService.findChannelByName(searchChannelDto.name);
      return {
        statusCode: HttpStatus.FOUND,
        data: channel,
        message: 'Channel retrieved successfully.',
        isSuccess: true
      };
    } catch (error) {
      console.log("DEBUG", error.message);
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'bad request.',
        isSuccess: false
      };
    }
  }

  /**
  * Récupère tous les canaux possédés par un utilisateur.
  * 
  * @route GET /canaux/user
  * @group Channels - Opérations concernant les canaux.
  * @uses JwtAuthGuard - Assurez-vous que la requête est authentifiée.
  * @returns {Promise<any>} 200 - La liste des canaux ou un message d'erreur.
  */

  /**
   * Récupère la liste de tous les canaux.
   * 
   * @route GET /
   * @group Channels - Opérations concernant les canaux.
   * @returns {Promise<any>} 200 - La liste des canaux ou un message d'erreur.
   */

  @Get('allChannel')
  async findAll(): Promise<any> {
    try {
      const channels: Channel[] = await this.channelService.findAllChannels();
      const newChannels = channels.filter(elem => elem.type === "public");
      return {
        statusCode: HttpStatus.FOUND,
        data: newChannels,
        message: 'Channels retrieved successfully.',
        isSuccess: true
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
          message: 'bad request.',
          isSuccess: false
        };
    }
  }

  /**
  * Met à jour un canal en fonction de l'ID de l'utilisateur et du DTO fourni
  * 
  * @route PUT /canaux/id
  * @param {Request} request - L'objet de requête.
  * @param {UpdateChannelDto} updateChannelDto - Données pour mettre à jour le canal.
  * @returns {Promise<Channel>} - Le canal mis à jour.
  * @throws {UnauthorizedException} - Si l'utilisateur n'est pas authentifié ou ne possède pas le canal.
  * @throws {NotFoundException} - Si le canal n'est pas trouvé.
  * @throws {BadRequestException} - Si les données fournies sont incorrectes.
  */
  // @UseGuards(JwtAuthGuard)
  @Put('updateById/:id')
  async updateChannel(@Param('id') userId: string, @Req() req, @Body() updateChannelDto: UpdateChannelDto): Promise<any> {
    try {
      // console.log("je suis dans updateChannel");
      const id = Number(userId);
     // const id = Number(req.id);
      const updatedChannel = await this.channelService.updateChannelByUserId(req.userId, updateChannelDto);

      return {
        statusCode: HttpStatus.OK,
        data: updatedChannel,
        message: 'Channel updated successfully.',
        isSuccess: true
      };
    } catch (error) {
      console.log("DEBUG", error.message);
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false
        };
      }
    }
  }

  @Get('/channel/:id')
  //@UseGuards(JwtAuthGuard)
  async getChannelsByUser(@Param('id') userId: string, @Req() request: any): Promise<any> {
    try {
      //console.log("je suis dans getChannelsByUser");
      // const id = Number(request.id);
      const id: number = Number(userId); 
      const channels: Channel[] = await this.channelService.getChannelsByUserId(id);
      return {
        statusCode: HttpStatus.FOUND,
        data: channels,
        message: 'Channels retrieved successfully.',
        isSuccess: true
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
          message: 'bad request.',
          isSuccess: false
        };
    }
  }

  @Get('missingChannels/:id')
  async getMissingChannels(@Param('id') userId: string, @Req() request: any): Promise<any> {
    try {
      const id: number = Number(userId);
      const userChannels: Channel[] = await this.channelService.getChannelsByUserId(id);

      const allChannels: Channel[] = await this.channelService.findAllChannels();

      const missingChannels: Channel[] = allChannels.filter((channel) => {
        return !userChannels.some((userChannel) => userChannel.id === channel.id);
      });

      return {
        statusCode: HttpStatus.OK,
        data: missingChannels,
        message: 'Missing channels retrieved successfully.',
        isSuccess: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
          isSuccess: false,
        };
      }
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request.',
        isSuccess: false,
      };
    }
  }

 /**
 * Supprime un canal par son nom. L'utilisateur doit être le propriétaire du canal pour effectuer la suppression.
 *
 * @route DELETE /canaux/delete-by-name
 * @param {Request} request - L'objet de requête.
 *
 * @returns {Promise<any>} - Un objet avec le statut de la suppression.
 *
 * @throws {NotFoundException} - Si le canal n'est pas trouvé avec le nom spécifié pour l'utilisateur actuel.
 * @throws {UnauthorizedException} - Si l'utilisateur actuel n'est pas autorisé à supprimer le canal.
 */
  @Delete('delete-by-name')
  async deleteChannelByName(@Req() request): Promise<any> {
    try {
      await this.channelService.deleteChannelByNameAndOwnerId(request.query.name, request.userId);
      return {
        statusCode: 200,
        message: 'Canal supprimé avec succès.',
        isSuccess: true
      };
    } catch (error) {
      console.log("DEBUG", error.message);

      if (error instanceof NotFoundException) {
        return {
          statusCode: 404,
          message: error.message,
          isSuccess: false
        };
      } else if (error instanceof UnauthorizedException) {
        return {
          statusCode: 401,
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: 400,
        message: 'Échec de la suppression du canal en raison d\'une mauvaise requête.',
        isSuccess: false
      };
    }
  }

  /**
   * Supprime tous les canaux de l'utilisateur actuel.
   *
   * @route DELETE /canaux/user/delete-all
   * @param {Request} request - L'objet de requête.
   *
   * @returns {Promise<any>} - Un objet avec le statut de la suppression de tous les canaux de l'utilisateur.
   *
   * @throws {UnauthorizedException} - Si l'utilisateur actuel n'est pas authentifié.
   */
  @Delete('user/delete-all')
  async deleteAllUserChannels(@Req() request): Promise<any> {
    try {
      await this.channelService.deleteAllChannelsByOwnerId(request.userId);
      return {
        statusCode: 200,
        message: 'Tous les canaux de l\'utilisateur ont été supprimés avec succès.',
        isSuccess: true
      };
    } catch (error) {
      console.log("DEBUG", error.message);

      if (error instanceof UnauthorizedException) {
        return {
          statusCode: 401,
          message: error.message,
          isSuccess: false
        };
      } return {
        statusCode: 400,
        message: 'Échec de la suppression de tous les canaux de l\'utilisateur en raison d\'une mauvaise requête.',
        isSuccess: false
      };
    }
  }






//////////////////////////////////////////////////////////////////// KICK BAN MUTE ////////////////////////////////////////////////////////////////////////////////////////////


















}