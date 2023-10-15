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
let ChannelService = class ChannelService {
    constructor(prisma) {
        this.prisma = prisma;
        this.ALGORITHM = 'aes-192-cbc';
        this.KEY_LENGTH = 24;
        this.IV_LENGTH = 16;
        this.PASSWORD = process.env.PASSWORD_2FA;
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
    async findChannelByname(name, userId) {
        const channel = await this.prisma.channel.findFirst({
            where: {
                ownerId: userId,
                name: name,
            },
        });
        if (channel)
            return channel;
        throw new common_1.HttpException('cannal exist', common_1.HttpStatus.CONFLICT);
    }
    async createChannel(createChannelDto) {
        try {
            const { name, type, ownerId, password } = createChannelDto;
            const id = Number(ownerId);
            const existingChannel = await this.findChannelByname(name, id);
            ;
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
            if (channel)
                return channel;
            throw new common_1.HttpException("cannal don't create", common_1.HttpStatus.NOT_IMPLEMENTED);
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
            throw error;
        }
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
    async findChannelsByUserId(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { ownedChannels: true }
            });
            if (!user || user.ownedChannels.length === 0)
                throw new common_1.HttpException(`Channels not found`, common_1.HttpStatus.NOT_FOUND);
            ;
            return user.ownedChannels;
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
            const channel = await this.findChannelByname(data.name, userId);
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
        const channel = await this.prisma.channel.findFirst({
            where: {
                name: name,
                ownerId: userId,
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException(`Aucun canal trouvé avec le nom ${name} pour l'utilisateur avec l'ID ${userId}`);
        }
        await this.prisma.channel.delete({
            where: { id: channel.id },
        });
    }
    async deleteAllChannelsByOwnerId(userId) {
        const channels = await this.prisma.channel.findMany({
            where: {
                ownerId: userId,
            },
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
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelService);
//# sourceMappingURL=chat.service.js.map