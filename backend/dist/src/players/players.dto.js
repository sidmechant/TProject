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
exports.FriendRequestIdDto = exports.SendFriendRequestDto = exports.PseudoDto = exports.UpdatePseudoDto = exports.UpdatePhotoDto = void 0;
const class_validator_1 = require("class-validator");
class UpdatePhotoDto {
}
exports.UpdatePhotoDto = UpdatePhotoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'URL ne doit pas être vide' }),
    (0, class_validator_1.IsString)({ message: 'L\'URL doit être une chaîne de caractères' }),
    __metadata("design:type", String)
], UpdatePhotoDto.prototype, "urlPhotoProfile", void 0);
class UpdatePseudoDto {
}
exports.UpdatePseudoDto = UpdatePseudoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le pseudo doit être une chaîne de caractères.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le pseudo ne peut pas être vide.' }),
    (0, class_validator_1.Length)(1, 15, { message: 'Le pseudo doit avoir entre 1 et 15 caractères.' }),
    __metadata("design:type", String)
], UpdatePseudoDto.prototype, "pseudo", void 0);
class PseudoDto {
}
exports.PseudoDto = PseudoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le pseudo ne peut pas être vide.' }),
    (0, class_validator_1.MaxLength)(15, {
        message: 'Le pseudo ne peut contenir plus de 15 caractères.',
    }),
    __metadata("design:type", String)
], PseudoDto.prototype, "pseudo", void 0);
class SendFriendRequestDto {
}
exports.SendFriendRequestDto = SendFriendRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 15, { message: 'Le pseudo doit contenir entre 1 et 15 caractères.' }),
    __metadata("design:type", String)
], SendFriendRequestDto.prototype, "receiverPseudo", void 0);
class FriendRequestIdDto {
}
exports.FriendRequestIdDto = FriendRequestIdDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], FriendRequestIdDto.prototype, "requesterId", void 0);
//# sourceMappingURL=players.dto.js.map