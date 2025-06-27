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
exports.AcceptInviteDto = exports.CreateInviteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateInviteDto {
}
exports.CreateInviteDto = CreateInviteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The UUID of the chama to invite the user to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInviteDto.prototype, "chamaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email address of the user to invite',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateInviteDto.prototype, "email", void 0);
class AcceptInviteDto {
}
exports.AcceptInviteDto = AcceptInviteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The token to accept',
        example: 'abcdef123456',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcceptInviteDto.prototype, "token", void 0);
