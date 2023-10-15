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
exports.ChannelSocketDto = exports.MessageSocketDto = exports.UserSocketDto = void 0;
const class_validator_1 = require("class-validator");
class UserSocketDto {
}
exports.UserSocketDto = UserSocketDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UserSocketDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserSocketDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserSocketDto.prototype, "displayname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserSocketDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UserSocketDto.prototype, "user", void 0);
class MessageSocketDto {
}
exports.MessageSocketDto = MessageSocketDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MessageSocketDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Array)
], MessageSocketDto.prototype, "messages", void 0);
class ChannelSocketDto {
}
exports.ChannelSocketDto = ChannelSocketDto;
//# sourceMappingURL=chat.dto.js.map