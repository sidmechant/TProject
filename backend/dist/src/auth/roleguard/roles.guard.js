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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const crud_service_1 = require("../forty-twoapi/crud.service");
let RolesGuard = class RolesGuard {
    constructor(reflector, crudService) {
        this.reflector = reflector;
        this.crudService = crudService;
    }
    async canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler());
        if (!roles)
            return true;
        const request = context.switchToHttp().getRequest();
        const userId = request.userId;
        if (!userId)
            throw new common_1.UnauthorizedException('No user id found in request');
        const user = await this.crudService.findUserById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        if (!roles.includes(user.role) || (user.role === 'STUDENT' && !user.isProfileUpdated))
            throw new common_1.UnauthorizedException('User does not have the required role or profile is not updated');
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        crud_service_1.CrudService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map