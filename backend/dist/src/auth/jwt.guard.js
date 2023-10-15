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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const crud_service_1 = require("./forty-twoapi/crud.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(crudService) {
        this.crudService = crudService;
        this.logger = new common_1.Logger('JwtAuthGuard');
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        this.logger.debug(` JWT GUARD ACTIVATED `);
        const isPublic = Reflect.getMetadata('isPublic', context.getHandler());
        if (isPublic) {
            console.log("ROUTE PUBLIQUE");
            return true;
        }
        this.logger.debug(` JWT GENERADATA ${isPublic} `);
        try {
            const cookie = request.cookies['jwt_token'];
            if (!cookie) {
                res.clearCookie('token');
                throw new common_1.UnauthorizedException('No token provided');
            }
            this.logger.debug(`JWT COOKIE ${cookie}`);
            const decoded = (0, jsonwebtoken_1.verify)(cookie, process.env.JWT_SECRET);
            if (!decoded || !decoded.sub || !decoded.sessionId) {
                res.clearCookie('jwt_token');
                res.clearCookie('token');
                console.log('PREMIERE ERREUR');
                this.logger.error(`UnauthorizedException decoded.sub ${decoded.sub} decoded session ${decoded.sessionId}`);
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const user = await this.crudService.findUserById(Number(decoded.sub));
            if (user.sessionId !== decoded.sessionId) {
                res.clearCookie('jwt_token');
                res.clearCookie('token');
                this.logger.error(`UnauthorizedException   decode session ${decoded.sessionId} user session ${user.sessionId}`);
                throw new common_1.UnauthorizedException('Logged in from another session');
            }
            request.user = user;
            request.userId = decoded.sub;
            this.logger.debug(`JWT FINISH user : ${user.id} ${request.id}`);
            return true;
        }
        catch (err) {
            console.log("PROBLEM GUARD: ", err);
            return false;
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [crud_service_1.CrudService])
], JwtAuthGuard);
//# sourceMappingURL=jwt.guard.js.map