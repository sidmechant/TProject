import { Injectable, ConflictException, BadRequestException, NotFoundException, HttpException, HttpStatus, Logger, Req, NotImplementedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateChannelDto, UpdateChannelDto, SearchChannelByNameDto, UpdateChannelByNameDto, CreateMessageDto } from '../dto/channel.dto';
import { PrismaService } from '../../prisma/prisma.service'
import { PrismaClient, Channel, ChannelMembership, Prisma, Message, User } from '@prisma/client'
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

      //this.addMemberToChannel(channel.id, channel.ownerId);
      this.addChannelMembershipToUser(channel.id, channel.ownerId);
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

      const newMember = await this.prisma.channelMembership.create({
        data: {
          userId,
          channelId,
        },
      });
      channel.members.push(newMember);

      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          members: {
            set: channel.members,
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

  //async listChannelsByUserId(userId: number): Promise<Channel[] | null> {
  //  try {
  //    const userWithChannels = await this.prisma.user.findUnique  ({
  //      where: {
  //        id: userId,
  //      },
  //      include: {
  //        channels: {
  //          include: {
  //            channel: true,
  //          },
  //        },
  //      },
  //    });

  //    if (!userWithChannels) {
  //      throw new Error('Utilisateur non trouvé');
  //    }
  //    if (userWithChannels.channels)
  //      return userWithChannels.channels;
  //    return null;
  //  } catch (error) {
  //    console.error(error);
  //    throw new Error('Une erreur s\'est produite lors de la récupération des canaux de l\'utilisateur.');
  //  }
  //}

  async getMessagesForChannel(channelId: string): Promise<Message[] | null> {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          channelId: channelId,
        },
      });
      if (messages) return messages;
      return null;
    } catch (error) {
      return null;
    }
  }

  async sendMessageToUserByUserId(senderId: number, receiverId: number, messageContent: string): Promise<void> {
    try {
      const sender = await this.userService.ifUserExistsByUserId(senderId);
      const receiver = await this.userService.ifUserExistsByUserId(receiverId);
      if (!sender || !receiver) {
        throw new Error('Sender or receiver not found');
      }

      let channel: Channel | null = await this.ifChannelExistsByName(`channel_${senderId}_${receiverId}`) as Channel | null;
      if (!channel) {
        channel = await this.createPrivateChannel(senderId, receiverId);
        if (!channel) {
          throw new Error('Channel creation failed');
        }
      }

      const createMessageDto: CreateMessageDto = {
        content: messageContent,
        userId: senderId.toString(),
        channelId: channel.id,
      };
      const message: Message | null = await this.createMessageUnique(createMessageDto);
      if (!message) {
        throw new Error('Message creation failed');
      }

      const messages: Message[] | null = await this.getMessagesForChannel(channel.id);
      if (messages) {
        throw new Error('Messages not found');
      }
      messages.push(message);

      await this.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          messages: {
            set: messages,
          },
        },
        include: {
          members: true,
          messages: true,
        },
      });

    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while sending the message.');
    }
  }


  async ifChannelExistsByName(name: string): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          name,
        },
        include: {
          messages: true,
          members: false,
        },
      });
      return channel || null;
    } catch (error) {
      return null;
    }
  }

  async createMessageUnique(createMessageDto: CreateMessageDto): Promise<Message | null> {
    try {
      const message = await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          channelId: createMessageDto.channelId,
          userId: Number(createMessageDto.userId),
        },
      });
      return message || null;
    } catch (error) {
      return null;
    }
  }

  async addMessageInChannel(createMessageDto): Promise<Message[] | null> {
    try {
      const messages: Message[] = await this.prisma.message.findMany({
        where: {
          id: createMessageDto.channelId,
        },
      });
      if (messages.length <= 0)
        throw new NotFoundException('Channel not found');
  
      const message = await this.createMessageUnique(createMessageDto);
      if (!message) 
        throw new NotImplementedException('message not created');
      
      const updatedMessages: Message[] = [...messages, message];
      const newChannel: Channel = await this.prisma.channel.update({
        where: {
          id: createMessageDto.channelId,
        },
        data: {
          messages: {
            set: updatedMessages,
          },
        },
      }); 
  
      return updatedMessages || null;
    } catch (error) {
      throw error;
    }
  }
  

  async createPrivateChannel(senderId: number, receiverId: number): Promise<Channel | null> {
    try {
      const channel = await this.prisma.channel.create({
        data: {
          name: `Private_${senderId}_${receiverId}`,
          type: 'private',
          ownerId: senderId,
          members: {
            create: [
              {
                userId: senderId,
              },
              {
                userId: receiverId,
              },
            ],
          },
        },
        include: {
          members: true,
          messages: true,
        },
      });

      return channel || null;
    } catch (error) {
      console.error(error);
      throw new Error('Conversation creation failed');
    }
  }

  async addChannelMembershipToUser(channelId: string, userId: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          channels: true,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }

      const newChannelMembership = await this.prisma.channelMembership.create({
        data: {
          userId,
          channelId,
        },
      });
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          channels: {
            connect: {
              id: newChannelMembership.id,
            },
          },
        },
        include: {
          channels: true,
        },
      });

      return updatedUser || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async removeChannelMembershipToUser(channelId: string, userId: number): Promise<boolean> {
    try {
      const channelMembership = await this.prisma.channelMembership.findFirst({
        where: {
          userId,
          channelId,
        },
      });

      if (!channelMembership) {
        return false;
      }

      await this.prisma.channelMembership.delete({
        where: {
          id: channelMembership.id,
        },
      });

      return true;
    } catch (error) {
      throw new error;
    }
  }

  async removeMemberToChannel(channelId: string, userId: number): Promise<ChannelMembership | null> {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new NotFoundException('Channel not found.');
      }

      const membership = await this.prisma.channelMembership.findFirst({
        where: {
          channelId,
          userId,
        },
      });
      if (!membership) {
        throw new NotFoundException('User is not a member of the channel.');
      }

      await this.prisma.channelMembership.delete({
        where: {
          id: membership.id,
        },
      });

      return membership || null;
    } catch (error) {
      throw new error;
    }
  }

 
  async getAvailableChannelsForUser(userId: number): Promise<Channel[]> {
    try {
        const availableChannels = await this.prisma.channel.findMany({
            where: {
                NOT: {
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                },
                type: {
                    not: "private"
                }
            },
            include: {
                members: true,
                messages: true
            }
        });
        return availableChannels;
    } catch (error) {
        console.error('Error fetching available channels:', error);
        throw error;
    }
}

  

} 