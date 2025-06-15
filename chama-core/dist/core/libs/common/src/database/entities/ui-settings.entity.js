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
exports.JsonFieldUtils = exports.UiSettingsEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * Custom decorator for JSON fields
 * Handles serialization and validation of JSON data
 */
function JsonField(description) {
    return function (target, propertyKey) {
        // Apply class-transformer Transform decorator
        (0, class_transformer_1.Transform)(({ value }) => {
            if (value === null || value === undefined) {
                return value;
            }
            // If it's already an object, return as-is
            if (typeof value === 'object') {
                return value;
            }
            // If it's a string, try to parse as JSON
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                }
                catch (_a) {
                    // If parsing fails, return the original string
                    return value;
                }
            }
            return value;
        })(target, propertyKey);
        // Apply ApiProperty decorator with dynamic description
        (0, swagger_1.ApiProperty)({
            description: description || `JSON field: ${propertyKey}`,
            type: 'object',
            additionalProperties: true,
            example: {},
        })(target, propertyKey);
    };
}
/**
 * UiSettings entity demonstrating JSON field handling
 *
 * Shows how to properly handle Prisma Json fields with custom decorators
 * and type-safe interfaces for structured JSON data.
 */
class UiSettingsEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UiSettingsEntity = UiSettingsEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the user these settings belong to',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UiSettingsEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to show tutorial messages to the user',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UiSettingsEntity.prototype, "showTutorial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Selected UI theme',
        example: 'dark',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UiSettingsEntity.prototype, "theme", void 0);
__decorate([
    JsonField('Configuration of widgets the user has seen or interacted with'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], UiSettingsEntity.prototype, "lastSeenWidgets", void 0);
/**
 * Helper functions for working with JSON fields
 */
class JsonFieldUtils {
    /**
     * Safely parse JSON string to object
     */
    static safeJsonParse(jsonString, defaultValue = null) {
        if (!jsonString || typeof jsonString !== 'string') {
            return defaultValue;
        }
        try {
            return JSON.parse(jsonString);
        }
        catch (_a) {
            return defaultValue;
        }
    }
    /**
     * Safely stringify object to JSON
     */
    static safeJsonStringify(obj) {
        if (obj === null || obj === undefined) {
            return null;
        }
        try {
            return JSON.stringify(obj);
        }
        catch (_a) {
            return null;
        }
    }
    /**
     * Merge widget settings with defaults
     */
    static mergeWidgetSettings(current, updates) {
        const defaultSettings = {
            dashboard: {
                contributions: true,
                transactions: true,
                notifications: true,
            },
            profile: {
                personalInfo: true,
                preferences: true,
            },
            chama: {
                membersList: true,
                contributionHistory: true,
            },
        };
        if (!current) {
            return Object.assign(Object.assign({}, defaultSettings), updates);
        }
        return {
            dashboard: Object.assign(Object.assign(Object.assign({}, defaultSettings.dashboard), current.dashboard), updates.dashboard),
            profile: Object.assign(Object.assign(Object.assign({}, defaultSettings.profile), current.profile), updates.profile),
            chama: Object.assign(Object.assign(Object.assign({}, defaultSettings.chama), current.chama), updates.chama),
        };
    }
}
exports.JsonFieldUtils = JsonFieldUtils;
