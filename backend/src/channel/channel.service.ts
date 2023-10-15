import { Injectable, ConflictException, BadRequestException, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateChannelDto, UpdateChannelDto, SearchChannelByNameDto, UpdateChannelByNameDto } from '../dto/channel.dto';
import { PrismaService } from '../../prisma/prisma.service'
import { PrismaClient, Channel, ChannelMembership, Prisma, Message, Player, User } from '@prisma/client'
import { channel } from 'diagnostics_channel';
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { GetChannelDto } from 'src/dto/channel.dto';
import { error } from 'console';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ChannelSocketDto } from 'src/dto/chat.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChannelService {
  public readonly ALGORITHM = 'aes-192-cbc';
  private readonly KEY_LENGTH = 24;
  private readonly IV_LENGTH = 16;
  private readonly PASSWORD = process.env.PASSWORD_2FA// Choisissez un mot de passe fort
  private key: Buffer;
  private logger: Logger = new Logger('ChannelService');

  constructor(private readonly prisma: PrismaService, private readonly userService: UsersService) {
    scrypt(this.PASSWORD, 'salt', this.KEY_LENGTH, (err, derivedKey) => {
      if (err) throw err;
      this.key = derivedKey;
    });
  }

  public encrypt(text: string): string {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  public decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv(this.ALGORITHM, this.key, iv);
    const decryptedBuffers = [decipher.update(encryptedText)]; // Retourne un Buffer
    decryptedBuffers.push(decipher.final()); // Ajoute un autre Buffer à notre tableau
    return Buffer.concat(decryptedBuffers).toString('utf8'); // Concatène et convertit en string
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    try {
      password = await bcrypt.hash(password, saltRounds);
      console.log("Je suis ici .... ", password);
      return password;
    } catch (err) {
      console.error("Error hashing the password", err);
      throw new Error("Failed to hash the password.");
    }
  }

  private async checkPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (err) {
      console.error("Error comparing the passwords", err);
      throw new Error("Failed to compare the passwords.");
    }
  }

  async createChannel1(userId: number, createChannelDto: CreateChannelDto): Promise<Channel> {
    const { name, type, password } = createChannelDto;

    this.logger.debug("je commence ici");
    const id = Number(userId);
    const existingChannel = await this.findChannelByName(name);
    this.logger.log(`Je suis dans createChannel ${name} ---- ${type} ---- ${password}`);
    if (existingChannel) {
      throw new HttpException('Channel already exists', HttpStatus.CONFLICT);
    }

    if (type === 'protected' && !password) {
      throw new HttpException('Password not found', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug("ici");
    const hashedPassword: string = type === 'protected' ? await this.encrypt(password) : null;

    const channel: Channel = await this.prisma.channel.create({
      data: {
        name,
        type,
        ownerId: id,
        password: hashedPassword
      }
    });
    if (channel) {
      this.logger.debug("Je suis enfin ici");
      return channel;
    }
    this.logger.debug("je suis surement la");
    throw new HttpException("Channel couldn't be created", HttpStatus.NOT_IMPLEMENTED);
  }

  public async findAllChannels(): Promise<Channel[]> {
    try {
      //console.log("je suis dans findAllChannels");
      const channels = await this.prisma.channel.findMany();
      if (channels.length > 0)
        return channels.map(channel => ({ ...channel, password: null }));
      throw new HttpException(`Channels not found`, HttpStatus.NOT_FOUND);;
    } catch (error) {
      throw error;
    }
  }

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    try {
      const { name, type, ownerId, password } = createChannelDto;

      const id = Number(ownerId);
      const existingChannel: Channel = await this.findChannelByName(name);
      if (existingChannel)
        throw new HttpException('cannal exist', HttpStatus.CONFLICT);

      if (type === 'protected' && !password)
        throw new HttpException('password not found', HttpStatus.BAD_REQUEST);

      const hashedPassword: string = type === 'protected' ? await this.encrypt(password) : null;

      const channel: Channel = await this.prisma.channel.create({
        data: {
          name,
          type,
          ownerId: id,
          password: hashedPassword
        }
      });
      if (channel) return channel;
      throw new HttpException("cannal don't create", HttpStatus.NOT_IMPLEMENTED)
    } catch (error) {
      throw error;
    }
  }

  async getChannelsByUserId(userId: number): Promise<Channel[]> {
    try {
      const channels = await this.prisma.channel.findMany({
        where: { ownerId: userId }
      });
      if (channels.length) return channels;
      throw new HttpException(`Channels not found`, HttpStatus.NOT_FOUND);;
    } catch (error) {
      throw error;
    }
  }

  diffChannel(channel: any, newChannel: UpdateChannelDto): boolean {
    if (channel.ownerId === newChannel.newownerId
      && channel.type === newChannel.newtype
      && channel.password === newChannel.newpassword
      && channel.name === newChannel.newname) {
      return true;
    } else if (!newChannel.newpassword
      && !newChannel.newownerId
      && !newChannel.newname
      && !newChannel.newtype) {
      return true;
    }
    return false;
  }

  updatePassword(channel: UpdateChannelDto, password: string, type: string): string {
    if (type === "protected" && password) {
      channel.newpassword = this.encrypt(password);
      return channel.newpassword;
    } else if (type === "public" || type === "private")
      return "";
    throw new BadRequestException('Un mot de passe est requis pour les canaux privés.');
  }

  updateType(channel: UpdateChannelDto, type: string): string {
    if (type === "protected" && channel.newpassword) {
      channel.newpassword = this.encrypt(channel.newpassword);
      console.log("Je suis ici maintenant .... ", channel.newpassword);
      return type;
    } else if (type === "private" || type === "public") {
      channel.newpassword = "";
      return type;
    }
    throw new HttpException('Not password', HttpStatus.BAD_REQUEST);
  }

  updateChannel(channel: any, newchannelDto: UpdateChannelDto): Channel {
    if (this.diffChannel(channel, newchannelDto))
      throw new HttpException('Not Modified', HttpStatus.NOT_MODIFIED);
    let newChannel: any = {}
    newChannel.type = newchannelDto.newtype ? this.updateType(newchannelDto, newchannelDto.newtype) : null;
    newChannel.name = newchannelDto.newname ? newchannelDto.newname : channel.name;
    newChannel.password = newchannelDto.newpassword ? this.updatePassword(newchannelDto, newchannelDto.newpassword, channel.type) : channel.password;
    newChannel.ownerId = newchannelDto.newownerId ? Number(newchannelDto.newownerId) : channel.ownerId;
    return newChannel;
  }

  async updateChannelByUserId(userId: number, data: UpdateChannelDto): Promise<Channel> {
    try {
      const channel = await this.findChannelByName(data.name);
      const newChannel: any = this.updateChannel(channel, data);
      return this.prisma.channel.update({
        where: { id: channel.id },
        data: newChannel,
      });
    } catch (error) {
      if (error instanceof HttpException)
        throw error;
      throw new HttpException("Not modified", HttpStatus.NOT_MODIFIED);
    }
  }

  async deleteChannelByNameAndOwnerId(name: string, userId: number): Promise<void> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: { name: name, ownerId: userId },
      });

      if (!channel)
        throw new NotFoundException(`Aucun canal trouvé avec le nom ${name} pour l'utilisateur avec l'ID ${userId}`);

      await this.prisma.channel.delete({
        where: { id: channel.id },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteChannelByName(name: string): Promise<void> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: { name: name },
      });

      if (!channel)
        throw new NotFoundException(`Aucun canal trouvé avec le nom ${name}`);

      await this.prisma.channel.delete({
        where: { id: channel.id },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAllChannelsByOwnerId(userId: number): Promise<void> {
    const channels = await this.prisma.channel.findMany({
      where: { ownerId: userId },
    });

    if (!channels || channels.length === 0) {
      throw new NotFoundException('Aucun canal trouvé pour cet utilisateur.');
    }

    for (const channel of channels) {
      await this.prisma.channel.delete({
        where: { id: channel.id },
      });
    }
  }

  async deleteChannelByChannelIdOwnerId(userId: number, channelId: string): Promise<void> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: { ownerId: userId, id: channelId },
      });

      if (!channel)
        throw new NotFoundException('Aucun canal trouvé pour cet utilisateur.');

      await this.prisma.channel.delete({
        where: { id: channel.id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findChannelByChannelIdOwnerId(channelId: string, ownerId: string) {
    try {
      const id = Number(ownerId);
      const channel = await this.prisma.channel.findFirst({
        where: { id: channelId, ownerId: id },
      });

      if (!channel)
        throw new NotFoundException('Canal non trouvé');
      if (channel.ownerId !== Number(ownerId))
        throw new NotFoundException('Canal non autorisé pour cet utilisateur');
      return channel;
    } catch (error) {
      throw error;
    }
  }

  async findAllChannelByOwnerId(channelId: string, ownerId: string) {
    try {
      const id = Number(ownerId);
      const channels = await this.prisma.channel.findMany({
        where: { ownerId: id },
      });

      if (channels.length > 0)
        return channels.map(channel => ({ ...channel, password: null }));
      throw new HttpException(`Channel with ownerId: ${ownerId} not found`, HttpStatus.NOT_FOUND);;
    } catch (error) {
      throw error;
    }
  }

  async findChannelByName(name: string): Promise<Channel | null> {
    try {
      const channel: Channel = await this.prisma.channel.findUnique({
        where: {
          name: name,
        },
      });
      if (channel) return channel;
      throw new HttpException(`Channel ${name} not found`, HttpStatus.NOT_FOUND);;
    } catch (error) {
      return null;
    }
  }

  async findChannelByNameOwnerId(name: string, ownerId: string): Promise<Channel | null> {
    try {
      const id = Number(ownerId);
      const channel: Channel = await this.prisma.channel.findUnique({
        where: { name: name, ownerId: id },
      });
      if (channel) return channel;
      throw new HttpException(`Channel ${name} not found`, HttpStatus.NOT_FOUND);;
    } catch (error) {
      throw error;
    }
  }

  async getChannelSocketDtoByChannel(channel: Channel): Promise<ChannelSocketDto> {
    let channelSocketDto: ChannelSocketDto | any = {};
    channelSocketDto.channel = channel;
    channelSocketDto.creator = await this.userService.getUserSocketDtoByUserId(channel.ownerId.toString());
    console.log("ICI");
    const errors = await validate(channelSocketDto);
    if (errors.length > 0)
      throw new Error('Validation failed');
    console.log("ICI");
    return channelSocketDto;
  }

  async addMemberToChannel(channelId: string, userId: number): Promise<Channel> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          members: true,
        },
      });
      if (!channel)
        throw new Error('Canal non trouvé');

      const isMember = channel.members.some((member) => member.userId === userId);
      if (isMember)
        throw new Error('Member not found ....');

      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          members: {
            create: {
              userId,
            },
          },
        },
        include: {
          members: true,
        },
      });
      return updatedChannel;
    } catch (error) {
      return null;
    }
  }

  async removeMemberFromChannel(channelId: string, userId: number): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          members: true,
        },
      });
      if (!channel)
        throw new Error('Canal non trouvé');

      const isMember = channel.members.some((member) => member.userId === userId);
      if (!isMember)
        throw new Error('Membre non trouvé');

      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          members: {
            deleteMany: {
              userId: userId,
            },
          },
        },
        include: {
          members: true,
        },
      });

      return updatedChannel;
    } catch (error) {
      return null;
    }
  }

  async listMembersByChannelId(channelId: string): Promise<ChannelMembership[]> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          members: true,
        },
      });
      if (!channel)
        throw new NotFoundException('Channel not found.');

      return channel.members;
    } catch (error) {
      return null;
    }
  }

  async addMessageToChannel(channelId: string, userId: number, content: string): Promise<Channel> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          messages: true,
        },
      });
      if (!channel)
        throw new Error('Cannal not found');

      const newMessage = await this.prisma.message.create({
        data: {
          content,
          channelId,
          userId,
        },
      });
      channel.messages.push(newMessage);

      await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          messages: {
            set: channel.messages,
          },
        },
      });
      return channel;
    } catch (error) {
      return null;
    }
  }
  
  async removeMessageChannelByMessageId(messageId: string): Promise<void> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!message)
        throw new NotFoundException(`Message avec l'ID ${messageId} non trouvé.`);

      await this.prisma.message.delete({
        where: { id: messageId },
      });
    } catch (error) {
      return null;
    }
  }

  async listMessageByChannelId(channelId: string): Promise<Message[]> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          messages: true,
        },
      });
      if (!channel)
        throw new NotFoundException('Channel not found.');

      return channel.messages;
    } catch (error) {
      return null;
    }
  }

  async findUserIdByPseudo(pseudo: string): Promise<number> {
    const player = await this.prisma.player.findFirst({
      where: { pseudo: pseudo },
  });
    if (!player) {
      throw new Error('Joueur introuvable');
    }
  
    return player.userId;
  }
  


  async setAdmin(actingUserId: number, targetUserId: number, channelId: string): Promise<ChannelMembership> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) throw new Error('Canal introuvable');

    // Vérification si l'utilisateur qui agit est le propriétaire du canal
    if (channel.ownerId !== actingUserId) {
      throw new Error('Seul le propriétaire du canal peut donner des droits d\'administrateur');
    }

    return this.prisma.channelMembership.update({
      where: {
        userId_channelId: {
          userId: targetUserId,
          channelId: channelId,
        },
      },
      data: {
        isAdmin: true,
        role: ChannelRole.ADMIN,
      },
    });
}


  async banUser(actingUserId: number, targetUserId: number, channelId: string): Promise<ChannelMembership> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) throw new Error('Canal introuvable');

    // Vérification si l'utilisateur cible est le propriétaire du canal
    if (channel.ownerId === targetUserId) throw new Error('Impossible de bannir le propriétaire du canal');

    // Vérification si l'utilisateur qui agit est le propriétaire ou un administrateur du canal
    const actingUserMembership = await this.prisma.channelMembership.findUnique({
      where: {
        userId_channelId: {
          userId: actingUserId,
          channelId: channelId,
        },
      },
    });
    if (actingUserMembership.role !== ChannelRole.ADMIN && channel.ownerId !== actingUserId) {
      throw new Error('Seul le propriétaire ou les administrateurs peuvent bannir les utilisateurs');
    }

    return this.prisma.channelMembership.update({
      where: {
        userId_channelId: {
          userId: targetUserId,
          channelId: channelId,
        },
      },
      data: {
        isBanned: true,
      },
    });
}

// Effectuez des modifications similaires pour muteUser et removeUser

async muteUser(actingUserId: number, targetUserId: number, channelId: string, duration: number): Promise<ChannelMembership> {
  const channel = await this.prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  if (!channel) throw new Error('Canal introuvable');

  // Vérification si l'utilisateur cible est le propriétaire du canal
  if (channel.ownerId === targetUserId) throw new Error('Impossible de mettre en sourdine le propriétaire du canal');

  // Vérification si l'utilisateur qui agit est le propriétaire ou un administrateur du canal
  const actingUserMembership = await this.prisma.channelMembership.findUnique({
    where: {
      userId_channelId: {
        userId: actingUserId,
        channelId: channelId,
      },
    },
  });
  if (actingUserMembership.role !== ChannelRole.ADMIN && channel.ownerId !== actingUserId) {
    throw new Error('Seul le propriétaire ou les administrateurs peuvent mettre en sourdine les utilisateurs');
  }

  const mutedUntil = new Date();
  mutedUntil.setMinutes(mutedUntil.getMinutes() + duration);

  return this.prisma.channelMembership.update({
    where: {
      userId_channelId: {
        userId: targetUserId,
        channelId: channelId,
      },
    },
    data: {
      mutedUntil: mutedUntil,
    },
  });
}

async removeUser(actingUserId: number, targetUserId: number, channelId: string): Promise<ChannelMembership> {
  const channel = await this.prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  if (!channel) throw new Error('Canal introuvable');

  // Vérification si l'utilisateur cible est le propriétaire du canal
  if (channel.ownerId === targetUserId) throw new Error('Impossible de supprimer le propriétaire du canal');

  // Vérification si l'utilisateur qui agit est le propriétaire ou un administrateur du canal
  const actingUserMembership = await this.prisma.channelMembership.findUnique({
    where: {
      userId_channelId: {
        userId: actingUserId,
        channelId: channelId,
      },
    },
  });
  if (actingUserMembership.role !== ChannelRole.ADMIN && channel.ownerId !== actingUserId) {
    throw new Error('Seul le propriétaire ou les administrateurs peuvent supprimer les utilisateurs');
  }

  return this.prisma.channelMembership.delete({
    where: {
      userId_channelId: {
        userId: targetUserId,
        channelId: channelId,
      },
    },
  });
}


  async findMembershipForUserInChannel(userId: number, channelId: string): Promise<ChannelMembership | null> {
    try {
      const membership = await this.prisma.channelMembership.findFirst({
        where: {
          userId: userId,
          channelId: channelId,
        },
      });
      if (!membership) 
        throw new HttpException(`Membership not found for user with ID ${userId} in channel with ID ${channelId}`, HttpStatus.NOT_FOUND);
  
      return membership;
    } catch (error) {
      throw error;
    }
  }

  private async isUserAdmin(userId: number, channelId: string): Promise<boolean> {
    const membership = await this.findMembershipForUserInChannel(userId, channelId);
    return membership?.isAdmin ?? false;
}


  /**
   * Find a channel by its ID.
   * @param id - Channel ID
   */
  async findChannelById(id: string): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }

    return channel;
  }

  /**
   * Find a ChannelMembership record for a user in a specific channel.
   * @param userId - User ID
   * @param channelId - Channel ID
   */
  // async findMembershipForUserInChannel(userId: number, channelId: string): Promise<ChannelMembership | null> {
  //   return await this.prisma.channelMembership.findFirst({
  //     where: {
  //       userId,
  //       channelId,
  //     },
  //   });
  // }
}
