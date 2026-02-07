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
exports.InviteEntity = exports.ChamaEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ChamaEntity = class ChamaEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.ChamaEntity = ChamaEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the chama',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChamaEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the chama',
        example: 'Investment Group',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChamaEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The description of the chama',
        example: 'A group for investment opportunities',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChamaEntity.prototype, "description", void 0);
exports.ChamaEntity = ChamaEntity = __decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:paramtypes", [Object])
], ChamaEntity);
let InviteEntity = class InviteEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.chama) {
            this.chama = new ChamaEntity(partial.chama);
        }
    }
};
exports.InviteEntity = InviteEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the invite',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InviteEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the chama that the invite is for',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InviteEntity.prototype, "chamaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The chama that the invite is for',
        type: ChamaEntity,
        required: false,
    }),
    (0, class_transformer_1.Type)(() => ChamaEntity),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ChamaEntity)
], InviteEntity.prototype, "chama", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique token for the invite',
        example: '7f9c2ba5-7f38-4bff-b61d-5d6c3caad65e',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteEntity.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email address the invite was sent to',
        example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteEntity.prototype, "sentToEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date when the invite expires',
        example: '2025-06-08T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value instanceof Date ? value : new Date(value))),
    __metadata("design:type", Date)
], InviteEntity.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date when the invite was used',
        example: '2025-06-02T14:57:46.109Z',
        required: false,
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? (value instanceof Date ? value : new Date(value)) : null),
    __metadata("design:type", Object)
], InviteEntity.prototype, "usedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date when the invite was created',
        example: '2025-06-01T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value instanceof Date ? value : new Date(value))),
    __metadata("design:type", Date)
], InviteEntity.prototype, "createdAt", void 0);
exports.InviteEntity = InviteEntity = __decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:paramtypes", [Object])
], InviteEntity);
