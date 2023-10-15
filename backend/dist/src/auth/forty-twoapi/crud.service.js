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
exports.CrudService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const ADMIN_IDS = [91763, 40335, 95280];
let CrudService = class CrudService extends prisma_service_1.PrismaService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async createUser(userObj) {
        try {
            console.log("DANS CREATE USER " + JSON.stringify(userObj, null, 2));
            let userItem = await this.prisma.user.findUnique({
                where: {
                    username: userObj.username,
                }
            });
            if (userItem) {
                console.log("RETURN USERITEM CAR IL EXISTE DEJA");
                return userItem;
            }
            console.log("TENTATIVE DE CREATION DE  L UTILISATEUR ");
            const role = ADMIN_IDS.includes(userObj.id) ? client_1.Role.ADMIN : client_1.Role.STUDENT;
            userItem = await this.prisma.user.create({
                data: {
                    id: userObj.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    username: userObj.username,
                    displayname: userObj.displayname,
                    lastname: userObj.lastname,
                    firstname: userObj.firstname,
                    role: role,
                    emails: userObj.emails,
                    phoneNumbers: userObj.phoneNumbers,
                    urlPhotoProfile: "",
                    profileurl: "",
                    photourl: "",
                    player: {
                        create: {
                            id: userObj.id,
                        },
                    },
                },
                include: {
                    player: true,
                },
            });
            if (!userItem) {
                throw new Error("Erreur lors de la création de l'utilisateur");
            }
            return userItem;
        }
        catch (error) {
            console.log("ICI HE HOOOO");
            console.log("Error CRUD: ", error);
            throw error;
        }
    }
    async findUserById(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        }
        catch (error) {
            console.error("Error finding user by ID:", error);
        }
    }
    async updateUserAuthenticationSecret(id, secret) {
        await this.prisma.user.update({
            where: { id: id },
            data: { twoFactorAuthenticationSecret: secret },
        });
    }
    async updateUserAuthenticationEnabled(id, value) {
        await this.prisma.user.update({
            where: { id: id },
            data: { isTwoFactorAuthenticationEnabled: value }
        });
        const user = this.findUserById(id);
        console.log((await user).isTwoFactorAuthenticationEnabled);
    }
    async getTwoFactorAuthenticationSecret(id) {
        const user = await this.findUserById(id);
        if (!user)
            throw new common_1.NotFoundException("Error getTwoFactorAuthenticationSecret");
        return user.twoFactorAuthenticationSecret;
    }
    async updateTwoFactorAuthenticationSecret(id, newSecret) {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { twoFactorAuthenticationSecret: newSecret },
        });
        if (!updatedUser)
            throw new common_1.NotFoundException("Error getTwoFactorAuthenticationSecret");
        return updatedUser.twoFactorAuthenticationSecret;
    }
    async updateSessionIdForUser(id, sessionId) {
        return this.prisma.user.update({
            where: { id: id },
            data: { sessionId: sessionId },
        }).catch(error => {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            throw error;
        });
    }
    async getSessionIdForUser(id) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return user?.sessionId || null;
    }
    async deleteSessionIdForUser(id) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return this.prisma.user.update({
            where: { id: id },
            data: { sessionId: null },
        });
    }
    async findBySessionId(sessionId) {
        const user = await this.prisma.user.findUnique({
            where: {
                sessionId: sessionId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with session ID ${sessionId} not found.`);
        }
        return user;
    }
    async checkProfileUpdated(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { player: true },
        });
        if (!user) {
            return false;
        }
        if (user.player.pseudo && user.player.urlPhotoProfile) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    isProfileUpdated: true,
                    role: 'USER',
                },
            });
            return true;
        }
        return false;
    }
};
exports.CrudService = CrudService;
exports.CrudService = CrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrudService);
//# sourceMappingURL=crud.service.js.map