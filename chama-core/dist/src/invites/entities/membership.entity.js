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
exports.MembershipEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const user_entity_1 = require("../../user/entities/user.entity");
const invite_entity_1 = require("./invite.entity");
let MembershipEntity = class MembershipEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new user_entity_1.UserEntity(partial.user);
        }
        if (partial.chama) {
            this.chama = new invite_entity_1.ChamaEntity(partial.chama);
        }
    }
};
exports.MembershipEntity = MembershipEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the membership',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MembershipEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MembershipEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The user associated with the membership',
        type: user_entity_1.UserEntity,
    }),
    (0, class_transformer_1.Type)(() => user_entity_1.UserEntity),
    __metadata("design:type", user_entity_1.UserEntity)
], MembershipEntity.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the chama',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MembershipEntity.prototype, "chamaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The chama associated with the membership',
        type: invite_entity_1.ChamaEntity,
    }),
    (0, class_transformer_1.Type)(() => invite_entity_1.ChamaEntity),
    __metadata("design:type", invite_entity_1.ChamaEntity)
], MembershipEntity.prototype, "chama", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The role of the user in the chama',
        enum: client_1.UserRole,
        example: client_1.UserRole.MEMBER,
    }),
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], MembershipEntity.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date when the user joined the chama',
        example: '2025-06-01T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value instanceof Date ? value : new Date(value))),
    __metadata("design:type", Date)
], MembershipEntity.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date when the membership was created',
        example: '2025-06-01T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value instanceof Date ? value : new Date(value))),
    __metadata("design:type", Date)
], MembershipEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date when the membership was last updated',
        example: '2025-06-01T14:57:46.109Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => (value instanceof Date ? value : new Date(value))),
    __metadata("design:type", Date)
], MembershipEntity.prototype, "updatedAt", void 0);
exports.MembershipEntity = MembershipEntity = __decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:paramtypes", [Object])
], MembershipEntity);
