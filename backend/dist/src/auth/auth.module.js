"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const forty_twoapi_module_1 = require("./forty-twoapi/forty-twoapi.module");
const jwt_module_1 = require("../jwt/jwt.module");
const passport_1 = require("@nestjs/passport");
const two_factor_authentication_service_1 = require("./two-factor-authentication/two-factor-authentication.service");
const two_factor_authentication_controller_1 = require("./two-factor-authentication/two-factor-authentication.controller");
const forty_twoapi_service_1 = require("./forty-twoapi/forty-twoapi.service");
const forty_twoapi_controller_1 = require("./forty-twoapi/forty-twoapi.controller");
const crud_service_1 = require("./forty-twoapi/crud.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        providers: [auth_service_1.AuthService, crud_service_1.CrudService, forty_twoapi_service_1.FortyTwoApiService, two_factor_authentication_service_1.TwoFactorAuthenticationService],
        controllers: [auth_controller_1.AuthController, forty_twoapi_controller_1.FortyTwoApiController, two_factor_authentication_controller_1.TwoFactorAuthenticationController],
        imports: [forty_twoapi_module_1.FortyTwoapiModule, jwt_module_1.JwtModule, passport_1.PassportModule, axios_1.HttpModule]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map