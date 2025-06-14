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
exports.Entity = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
/**
 * Base entity class that implements common fields for all database entities
 *
 * This abstract class provides the standard id, createdAt, and updatedAt fields
 * that are common across most database models in the application.
 *
 * @template T - The type of the entity that extends this base class
 */
class Entity {
    /**
     * Constructor that allows partial initialization of the entity
     *
     * @param partial - Partial object containing entity properties
     */
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.Entity = Entity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsUUID)(4),
    __metadata("design:type", String)
], Entity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time when the entity was created',
        example: '2025-06-07T09:35:54.000Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => value instanceof Date ? value : new Date(value)),
    __metadata("design:type", Date)
], Entity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time when the entity was last updated',
        example: '2025-06-07T09:35:54.000Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => value instanceof Date ? value : new Date(value)),
    __metadata("design:type", Date)
], Entity.prototype, "updatedAt", void 0);
