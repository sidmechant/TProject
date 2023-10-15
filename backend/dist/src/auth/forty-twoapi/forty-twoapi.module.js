"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortyTwoapiModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const forty_twoapi_service_1 = require("./forty-twoapi.service");
const forty_twoapi_controller_1 = require("./forty-twoapi.controller");
const crud_service_1 = require("./crud.service");
const JwtStrategy_1 = require("../../jwt/JwtStrategy");
const jwt_module_1 = require("../../jwt/jwt.module");
let FortyTwoapiModule = class FortyTwoapiModule {
};
exports.FortyTwoapiModule = FortyTwoapiModule;
exports.FortyTwoapiModule = FortyTwoapiModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, jwt_module_1.JwtModule],
        providers: [forty_twoapi_service_1.FortyTwoApiService, crud_service_1.CrudService, JwtStrategy_1.JwtStrategy],
        controllers: [forty_twoapi_controller_1.FortyTwoApiController]
    })
], FortyTwoapiModule);
//# sourceMappingURL=forty-twoapi.module.js.map