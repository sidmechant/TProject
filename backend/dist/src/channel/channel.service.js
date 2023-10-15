"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const class_validator_1 = require("class-validator");
const users_service_1 = require("../users/users.service");
let ChannelService = class ChannelService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
        this.ALGORITHM = 'aes-192-cbc';
        this.KEY_LENGTH = 24;
        this.IV_LENGTH = 16;
        this.PASSWORD = process.env.PASSWORD_2FA;
        this.logger = new common_1.Logger('ChannelService');
        (0, crypto_1.scrypt)(this.PASSWORD, 'salt', this.KEY_LENGTH, (err, derivedKey) => {
            if (err)
                throw err;
            this.key = derivedKey;
        });
    }
    encrypt(text) {
        const iv = (0, crypto_1.randomBytes)(this.IV_LENGTH);
        const cipher = (0, crypto_1.createCipheriv)(this.ALGORITHM, this.key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    decrypt(text) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = (0, crypto_1.createDecipheriv)(this.ALGORITHM, this.key, iv);
        const decryptedBuffers = [decipher.update(encryptedText)];
        decryptedBuffers.push(decipher.final());
        return Buffer.concat(decryptedBuffers).toString('utf8');
    }
    async hashPassword(password) {
        const saltRounds = 10;
        try {
            password = await bcrypt.hash(password, saltRounds);
            console.log("Je suis ici .... ", password);
            return password;
        }
        catch (err) {
            console.error("Error hashing the password", err);
            throw new Error("Failed to hash the password.");
        }
    }
    async checkPassword(inputPassword, hashedPassword) {
        try {
            return await bcrypt.compare(inputPassword, hashedPassword);
        }
        catch (err) {
            console.error("Error comparing the passwords", err);
            throw new Error("Failed to compare the passwords.");
        }
    }
    async createChannel1(userId, createChannelDto) {
        const { name, type, password } = createChannelDto;
        this.logger.debug("je commence ici");
        const id = Number(userId);
        const existingChannel = await this.findChannelByName(name);
        this.logger.log(`Je suis dans createChannel ${name} ---- ${type} ---- ${password}`);
        if (existingChannel) {
            throw new common_1.HttpException('Channel already exists', common_1.HttpStatus.CONFLICT);
        }
        if (type === 'protected' && !password) {
            throw new common_1.HttpException('Password not found', common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.debug("ici");
        const hashedPassword = type === 'protected' ? await this.encrypt(password) : null;
        const channel = await this.prisma.channel.create({
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
        throw new common_1.HttpException("Channel couldn't be created", common_1.HttpStatus.NOT_IMPLEMENTED);
    }
    async findAllChannels() {
        try {
            const channels = await this.prisma.channel.findMany();
            if (channels.length > 0)
                return channels.map(channel => ({ ...channel, password: null }));
            throw new common_1.HttpException(`Channels not found`, common_1.HttpStatus.NOT_FOUND);
            ;
        }
        catch (error) {
            throw error;
        }
    }
    async createChannel(createChannelDto) {
        try {
            const { name, type, ownerId, password } = createChannelDto;
            const id = Number(ownerId);
            const existingChannel = await this.findChannelByName(name);
            if (existingChannel)
                throw new common_1.HttpException('cannal exist', common_1.HttpStatus.CONFLICT);
            if (type === 'protected' && !password)
                throw new common_1.HttpException('password not found', common_1.HttpStatus.BAD_REQUEST);
            const hashedPassword = type === 'protected' ? await this.encrypt(password) : null;
            const channel = await this.prisma.channel.create({
                data: {
                    name,
                    type,
                    ownerId: id,
                    password: hashedPassword
                }
            });
            this.addChannelMembershipToUser(channel.id, channel.ownerId);
            if (channel)
                return channel;
            throw new common_1.HttpException("cannal don't create", common_1.HttpStatus.NOT_IMPLEMENTED);
        }
        catch (error) {
            throw error;
        }
    }
    async getChannelsByUserId(userId) {
        try {
            const channels = await this.prisma.channel.findMany({
                where: { ownerId: userId }
            });
            if (channels.length)
                return channels;
            throw new common_1.HttpException(`Channels not found`, common_1.HttpStatus.NOT_FOUND);
            ;
        }
        catch (error) {
            throw error;
        }
    }
    diffChannel(channel, newChannel) {
        if (channel.ownerId === newChannel.newownerId
            && channel.type === newChannel.newtype
            && channel.password === newChannel.newpassword
            && channel.name === newChannel.newname) {
            return true;
        }
        else if (!newChannel.newpassword
            && !newChannel.newownerId
            && !newChannel.newname
            && !newChannel.newtype) {
            return true;
        }
        return false;
    }
    updatePassword(channel, password, type) {
        if (type === "protected" && password) {
            channel.newpassword = this.encrypt(password);
            return channel.newpassword;
        }
        else if (type === "public" || type === "private")
            return "";
        throw new common_1.BadRequestException('Un mot de passe est requis pour les canaux privés.');
    }
    updateType(channel, type) {
        if (type === "protected" && channel.newpassword) {
            channel.newpassword = this.encrypt(channel.newpassword);
            console.log("Je suis ici maintenant .... ", channel.newpassword);
            return type;
        }
        else if (type === "private" || type === "public") {
            channel.newpassword = "";
            return type;
        }
        throw new common_1.HttpException('Not password', common_1.HttpStatus.BAD_REQUEST);
    }
    updateChannel(channel, newchannelDto) {
        if (this.diffChannel(channel, newchannelDto))
            throw new common_1.HttpException('Not Modified', common_1.HttpStatus.NOT_MODIFIED);
        let newChannel = {};
        newChannel.type = newchannelDto.newtype ? this.updateType(newchannelDto, newchannelDto.newtype) : null;
        newChannel.name = newchannelDto.newname ? newchannelDto.newname : channel.name;
        newChannel.password = newchannelDto.newpassword ? this.updatePassword(newchannelDto, newchannelDto.newpassword, channel.type) : channel.password;
        newChannel.ownerId = newchannelDto.newownerId ? Number(newchannelDto.newownerId) : channel.ownerId;
        return newChannel;
    }
    async updateChannelByUserId(userId, data) {
        try {
            const channel = await this.findChannelByName(data.name);
            const newChannel = this.updateChannel(channel, data);
            return this.prisma.channel.update({
                where: { id: channel.id },
                data: newChannel,
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException("Not modified", common_1.HttpStatus.NOT_MODIFIED);
        }
    }
    async deleteChannelByNameAndOwnerId(name, userId) {
        try {
            const channel = await this.prisma.channel.findFirst({
                where: { name: name, ownerId: userId },
            });
            if (!channel)
                throw new common_1.NotFoundException(`Aucun canal trouvé avec le nom ${name} pour l'utilisateur avec l'ID ${userId}`);
            await this.prisma.channel.delete({
                where: { id: channel.id },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async deleteChannelByName(name) {
        try {
            const channel = await this.prisma.channel.findFirst({
                where: { name: name },
            });
            if (!channel)
                throw new common_1.NotFoundException(`Aucun canal trouvé avec le nom ${name}`);
            await this.prisma.channel.delete({
                where: { id: channel.id },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async deleteAllChannelsByOwnerId(userId) {
        const channels = await this.prisma.channel.findMany({
            where: { ownerId: userId },
        });
        if (!channels || channels.length === 0) {
            throw new common_1.NotFoundException('Aucun canal trouvé pour cet utilisateur.');
        }
        for (const channel of channels) {
            await this.prisma.channel.delete({
                where: { id: channel.id },
            });
        }
    }
    async deleteChannelByChannelIdOwnerId(userId, channelId) {
        try {
            const channel = await this.prisma.channel.findFirst({
                where: { ownerId: userId, id: channelId },
            });
            if (!channel)
                throw new common_1.NotFoundException('Aucun canal trouvé pour cet utilisateur.');
            await this.prisma.channel.delete({
                where: { id: channel.id },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findChannelByChannelIdOwnerId(channelId, ownerId) {
        try {
            const id = Number(ownerId);
            const channel = await this.prisma.channel.findFirst({
                where: { id: channelId, ownerId: id },
            });
            if (!channel)
                throw new common_1.NotFoundException('Canal non trouvé');
            if (channel.ownerId !== Number(ownerId))
                throw new common_1.NotFoundException('Canal non autorisé pour cet utilisateur');
            return channel;
        }
        catch (error) {
            throw error;
        }
    }
    async findAllChannelByOwnerId(channelId, ownerId) {
        try {
            const id = Number(ownerId);
            const channels = await this.prisma.channel.findMany({
                where: { ownerId: id },
            });
            if (channels.length > 0)
                return channels.map(channel => ({ ...channel, password: null }));
            throw new common_1.HttpException(`Channel with ownerId: ${ownerId} not found`, common_1.HttpStatus.NOT_FOUND);
            ;
        }
        catch (error) {
            throw error;
        }
    }
    async findChannelByName(name) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    name: name,
                },
            });
            if (channel)
                return channel;
            throw new common_1.HttpException(`Channel ${name} not found`, common_1.HttpStatus.NOT_FOUND);
            ;
        }
        catch (error) {
            return null;
        }
    }
    async findChannelByNameOwnerId(name, ownerId) {
        try {
            const id = Number(ownerId);
            const channel = await this.prisma.channel.findUnique({
                where: { name: name, ownerId: id },
            });
            if (channel)
                return channel;
            throw new common_1.HttpException(`Channel ${name} not found`, common_1.HttpStatus.NOT_FOUND);
            ;
        }
        catch (error) {
            throw error;
        }
    }
    async getChannelSocketDtoByChannel(channel) {
        let channelSocketDto = {};
        channelSocketDto.channel = channel;
        channelSocketDto.creator = await this.userService.getUserSocketDtoByUserId(channel.ownerId.toString());
        console.log("ICI");
        const errors = await (0, class_validator_1.validate)(channelSocketDto);
        if (errors.length > 0)
            throw new Error('Validation failed');
        console.log("ICI");
        return channelSocketDto;
    }
    async addMemberToChannel(channelId, userId) {
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
        }
        catch (error) {
            return null;
        }
    }
    async removeMemberFromChannel(channelId, userId) {
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
        }
        catch (error) {
            return null;
        }
    }
    async listMembersByChannelId(channelId) {
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
                throw new common_1.NotFoundException('Channel not found.');
            return channel.members;
        }
        catch (error) {
            return null;
        }
    }
    async addMessageToChannel(channelId, userId, content) {
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
        }
        catch (error) {
            return null;
        }
    }
    async removeMessageChannelByMessageId(messageId) {
        try {
            const message = await this.prisma.message.findUnique({
                where: { id: messageId },
            });
            if (!message)
                throw new common_1.NotFoundException(`Message avec l'ID ${messageId} non trouvé.`);
            await this.prisma.message.delete({
                where: { id: messageId },
            });
        }
        catch (error) {
            return null;
        }
    }
    async listMessageByChannelId(channelId) {
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
                throw new common_1.NotFoundException('Channel not found.');
            return channel.messages;
        }
        catch (error) {
            return null;
        }
    }
    async getMessagesForChannel(channelId) {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    channelId: channelId,
                },
            });
            if (messages)
                return messages;
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async sendMessageToUserByUserId(senderId, receiverId, messageContent) {
        try {
            const sender = await this.userService.ifUserExistsByUserId(senderId);
            const receiver = await this.userService.ifUserExistsByUserId(receiverId);
            if (!sender || !receiver) {
                throw new Error('Sender or receiver not found');
            }
            let channel = await this.ifChannelExistsByName(`channel_${senderId}_${receiverId}`);
            if (!channel) {
                channel = await this.createPrivateChannel(senderId, receiverId);
                if (!channel) {
                    throw new Error('Channel creation failed');
                }
            }
            const createMessageDto = {
                content: messageContent,
                userId: senderId.toString(),
                channelId: channel.id,
            };
            const message = await this.createMessageUnique(createMessageDto);
            if (!message) {
                throw new Error('Message creation failed');
            }
            const messages = await this.getMessagesForChannel(channel.id);
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
        }
        catch (error) {
            console.error(error);
            throw new Error('An error occurred while sending the message.');
        }
    }
    async ifChannelExistsByName(name) {
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
        }
        catch (error) {
            return null;
        }
    }
    async createMessageUnique(createMessageDto) {
        try {
            const message = await this.prisma.message.create({
                data: {
                    content: createMessageDto.content,
                    channelId: createMessageDto.channelId,
                    userId: Number(createMessageDto.userId),
                },
            });
            return message || null;
        }
        catch (error) {
            return null;
        }
    }
    async addMessageInChannel(createMessageDto) {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    id: createMessageDto.channelId,
                },
            });
            if (messages.length <= 0)
                throw new common_1.NotFoundException('Channel not found');
            const message = await this.createMessageUnique(createMessageDto);
            if (!message)
                throw new common_1.NotImplementedException('message not created');
            const updatedMessages = [...messages, message];
            const newChannel = await this.prisma.channel.update({
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
        }
        catch (error) {
            throw error;
        }
    }
    async createPrivateChannel(senderId, receiverId) {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Conversation creation failed');
        }
    }
    async addChannelMembershipToUser(channelId, userId) {
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
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async removeChannelMembershipToUser(channelId, userId) {
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
        }
        catch (error) {
            throw new error;
        }
    }
    async removeMemberToChannel(channelId, userId) {
        try {
            const channel = await this.prisma.channel.findFirst({
                where: {
                    id: channelId,
                },
            });
            if (!channel) {
                throw new common_1.NotFoundException('Channel not found.');
            }
            const membership = await this.prisma.channelMembership.findFirst({
                where: {
                    channelId,
                    userId,
                },
            });
            if (!membership) {
                throw new common_1.NotFoundException('User is not a member of the channel.');
            }
            await this.prisma.channelMembership.delete({
                where: {
                    id: membership.id,
                },
            });
            return membership || null;
        }
        catch (error) {
            throw new error;
        }
    }
    async getAvailableChannelsForUser(userId) {
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
        }
        catch (error) {
            console.error('Error fetching available channels:', error);
            throw error;
        }
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, users_service_1.UsersService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map