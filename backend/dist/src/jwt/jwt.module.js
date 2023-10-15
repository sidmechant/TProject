"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("./jwt.service");
const JwtStrategy_1 = require("./JwtStrategy");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let JwtModule = class JwtModule {
};
exports.JwtModule = JwtModule;
exports.JwtModule = JwtModule = __decorate([
    (0, common_1.Module)({
        providers: [jwt_service_1.JwtService, JwtStrategy_1.JwtStrategy, crud_service_1.CrudService, jwt_guard_1.JwtAuthGuard],
        exports: [jwt_service_1.JwtService, JwtStrategy_1.JwtStrategy, crud_service_1.CrudService, jwt_guard_1.JwtAuthGuard],
    })
], JwtModule);
//# sourceMappingURL=jwt.module.js.map