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
exports.DecimalUtils = exports.ContributionEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const decimal_js_1 = require("decimal.js");
const base_entity_1 = require("./base.entity");
const models_1 = require("../models");
/**
 * Transformer to convert Prisma Decimal to number for API responses
 * and accept both number and string inputs
 */
function DecimalTransformer() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (value === null || value === undefined) {
            return value;
        }
        // If it's already a Decimal, convert to number
        if (value instanceof decimal_js_1.Decimal) {
            return value.toNumber();
        }
        // If it's a string or number, ensure it's a valid decimal
        const decimal = new decimal_js_1.Decimal(value);
        return decimal.toNumber();
    });
}
/**
 * Contribution entity class demonstrating Decimal field handling
 *
 * Shows how to properly handle Prisma Decimal fields with transformers
 * for API serialization while maintaining type safety.
 */
class ContributionEntity extends base_entity_1.Entity {
    constructor(partial) {
        super(partial);
    }
}
exports.ContributionEntity = ContributionEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the chama this contribution belongs to',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContributionEntity.prototype, "chamaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the user making the contribution',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContributionEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of the contribution',
        example: 1000.5,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, {
        message: 'Amount must be a number with at most 2 decimal places',
    }),
    DecimalTransformer(),
    __metadata("design:type", decimal_js_1.Decimal)
], ContributionEntity.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code for the contribution',
        example: 'KES',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContributionEntity.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the contribution',
        enum: models_1.ContributionStatus,
        example: models_1.ContributionStatus.PENDING,
    }),
    (0, class_validator_1.IsEnum)(models_1.ContributionStatus, {
        message: `Status must be one of: ${Object.values(models_1.ContributionStatus).join(', ')}`,
    }),
    __metadata("design:type", String)
], ContributionEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the contribution was made',
        example: '2025-06-07T09:35:54.000Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ContributionEntity.prototype, "date", void 0);
/**
 * Helper functions for working with Decimal fields
 */
class DecimalUtils {
    /**
     * Convert a Decimal to number safely
     */
    static toNumber(decimal) {
        if (decimal === null || decimal === undefined) {
            return null;
        }
        if (typeof decimal === 'number') {
            return decimal;
        }
        if (decimal instanceof decimal_js_1.Decimal) {
            return decimal.toNumber();
        }
        return new decimal_js_1.Decimal(decimal).toNumber();
    }
    /**
     * Convert a number or string to Decimal
     */
    static toDecimal(value) {
        if (value === null || value === undefined) {
            return null;
        }
        if (value instanceof decimal_js_1.Decimal) {
            return value;
        }
        return new decimal_js_1.Decimal(value);
    }
    /**
     * Format decimal as currency string
     */
    static formatCurrency(decimal, currency = 'KES') {
        const num = DecimalUtils.toNumber(decimal);
        if (num === null) {
            return `${currency} 0.00`;
        }
        return `${currency} ${num.toFixed(2)}`;
    }
}
exports.DecimalUtils = DecimalUtils;
