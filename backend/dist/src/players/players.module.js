"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersModule = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("./players.service");
const players_controller_1 = require("./players.controller");
const prisma_service_1 = require("../../prisma/prisma.service");
const crud_service_1 = require("../auth/forty-twoapi/crud.service");
let PlayersModule = class PlayersModule {
};
exports.PlayersModule = PlayersModule;
exports.PlayersModule = PlayersModule = __decorate([
    (0, common_1.Module)({
        providers: [players_service_1.PlayersService, prisma_service_1.PrismaService, crud_service_1.CrudService],
        controllers: [players_controller_1.PlayersController],
        exports: [players_service_1.PlayersService],
    })
], PlayersModule);
//# sourceMappingURL=players.module.js.map