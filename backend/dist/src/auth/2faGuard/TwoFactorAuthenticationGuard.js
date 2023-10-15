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
exports.TwoFactorAuthenticationGuard = void 0;
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../forty-twoapi/crud.service");
const common_2 = require("@nestjs/common");
let TwoFactorAuthenticationGuard = class TwoFactorAuthenticationGuard {
    constructor(crudService) {
        this.crudService = crudService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.userId;
        try {
            const isPublic = Reflect.getMetadata('isPublic', context.getHandler());
            if (isPublic) {
                console.log("ROUTE PUBLIQUE");
                return true;
            }
            const skip2faGuard = Reflect.getMetadata('skip2faGuard', context.getHandler());
            if (skip2faGuard) {
                return true;
            }
            const dbUser = await this.crudService.findUserById(userId);
            if (dbUser && dbUser.isTwoFactorAuthenticationEnabled) {
                console.log("CHECK COOKIE 2fa");
                if (request.cookies['2fa_token']) {
                    return true;
                }
                console.log("CHECK COOKIE FALSE");
                throw new common_2.UnauthorizedException({
                    statusCode: 428,
                    error: 'Two-factor authentication is required.',
                });
            }
            return true;
        }
        catch (error) {
            console.error("Error in TwoFactorAuthenticationGuard:", error);
            throw new common_2.UnauthorizedException({
                statusCode: 428,
                error: 'Two-factor authentication is required.'
            });
        }
    }
};
exports.TwoFactorAuthenticationGuard = TwoFactorAuthenticationGuard;
exports.TwoFactorAuthenticationGuard = TwoFactorAuthenticationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [crud_service_1.CrudService])
], TwoFactorAuthenticationGuard);
//# sourceMappingURL=TwoFactorAuthenticationGuard.js.map