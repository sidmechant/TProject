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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthenticationController = exports.TwoFactorAuthenticationCodeDto = void 0;
const common_1 = require("@nestjs/common");
const two_factor_authentication_service_1 = require("./two-factor-authentication.service");
const jwt_guard_1 = require("../jwt.guard");
const qrcode = require("qrcode");
const crud_service_1 = require("../forty-twoapi/crud.service");
const two_factor_authentification_dto_1 = require("./two-factor-authentification.dto");
const crypto_1 = require("crypto");
const Skip2FA_guard_1 = require("../2faGuard/Skip2FA.guard");
class TwoFactorAuthenticationCodeDto {
}
exports.TwoFactorAuthenticationCodeDto = TwoFactorAuthenticationCodeDto;
let TwoFactorAuthenticationController = class TwoFactorAuthenticationController extends crud_service_1.CrudService {
    constructor(twoFactorAuthenticationService, crud) {
        super(crud);
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.crud = crud;
    }
    async register(req, response) {
        try {
            const id = req.userId;
            console.log("ID ----- : ", id);
            const { secret, otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(id);
            const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
            const encryptedSecret = this.twoFactorAuthenticationService.encrypt(secret);
            await this.crud.updateTwoFactorAuthenticationSecret(id, encryptedSecret);
            console.log("RESPONSE QRCODE ::::::: ", qrCodeDataUrl);
            response.json({
                qrCodeDataUrl: qrCodeDataUrl
            });
        }
        catch (error) {
            console.log('Erreur dans le controller generate', error);
            throw new common_1.NotFoundException('Erreur lors de la mise à jour du secret 2fa', error);
        }
    }
    async turnOnTwoFactorAuthentication(req, response, twoFactorAuthCodeDto) {
        try {
            console.log("TURN ON CONTROLLER");
            const id = req.userId;
            console.log("TURN ON CONTROLLER");
            console.log("TURN ON CONTROLLER", twoFactorAuthCodeDto);
            const { twoFactorAuthenticationCode } = twoFactorAuthCodeDto;
            const encryptedPass = await this.crud.getTwoFactorAuthenticationSecret(id);
            const AuthenticationSecret = this.twoFactorAuthenticationService.decrypt(encryptedPass);
            console.log("Encrypted Pass:", encryptedPass);
            console.log("Decrypted Authentication Secret:", AuthenticationSecret);
            console.log("CODE" + twoFactorAuthenticationCode);
            const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, AuthenticationSecret);
            if (!isCodeValid) {
                console.error('Invalid authentication code for user ID:', id);
                throw new common_1.UnauthorizedException('Invalid authentication code.');
            }
            await this.twoFactorAuthenticationService.turnOnTwoFactorAuthentication(id);
            const token = (0, crypto_1.randomBytes)(64).toString('hex');
            response.cookie('2fa_token', token, {
                httpOnly: false,
                sameSite: 'strict'
            });
            response.status(200).send({
                statusCode: 200,
                message: 'Two-factor authentication activated successfully.',
                isSuccess: true
            });
            return;
            console.log(response.headersSent);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.BadRequestException(error.message);
            }
            console.error('Error during two-factor authentication activation for user ID:', error.message);
            throw new common_1.BadRequestException('Failed to activate two-factor authentication.');
        }
    }
    async updatebool(req, response) {
        try {
            const id = req.userId;
            await this.twoFactorAuthenticationService.turnOffAuthentification(id);
            response.clearCookie('2fa_token');
            return response.status(200).json({
                statusCode: 200,
                message: "Two-factor authentication disabled"
            });
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                return {
                    statusCode: 401,
                    message: error.message,
                    isSuccess: false
                };
            }
        }
    }
};
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, Skip2FA_guard_1.Skip2FAGuard)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, Skip2FA_guard_1.Skip2FAGuard)(),
    (0, common_1.Post)('turn-on'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, two_factor_authentification_dto_1.TurnOnTwoFactorAuthDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Patch)('users'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, Skip2FA_guard_1.Skip2FAGuard)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "updatebool", null);
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController = __decorate([
    (0, common_1.Controller)('2fa'),
    __metadata("design:paramtypes", [two_factor_authentication_service_1.TwoFactorAuthenticationService,
        crud_service_1.CrudService])
], TwoFactorAuthenticationController);
//# sourceMappingURL=two-factor-authentication.controller.js.map