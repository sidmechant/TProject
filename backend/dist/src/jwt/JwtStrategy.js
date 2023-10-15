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
exports.JwtStrategy = void 0;
const passport_custom_1 = require("passport-custom");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../jwt/jwt.service");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_custom_1.Strategy, 'jwt') {
    constructor(jwtService, crudService) {
        super();
        this.jwtService = jwtService;
        this.crudService = crudService;
    }
    async validate(request, response, id) {
        try {
            console.log('VALIDATE TOKEN SIGN');
            const sessionId = this.jwtService.qgenerateUniqueSessionId(id);
            console.log('SESSION ID ', sessionId);
            const userId = Number(id);
            const updated = await this.crudService.updateSessionIdForUser(userId, sessionId);
            if (!updated) {
                throw new Error('Failed to update sessionId for user');
            }
            const token = this.jwtService.createToken(id, sessionId);
            console.log('TOKEN SIGN ', token);
            response.cookie('jwt_token', token, { httpOnly: false, sameSite: 'strict' });
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async authenticateUser(credentials) {
    }
};
exports.JwtStrategy = JwtStrategy;
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], JwtStrategy.prototype, "validate", null);
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtService,
        crud_service_1.CrudService])
], JwtStrategy);
//# sourceMappingURL=JwtStrategy.js.map