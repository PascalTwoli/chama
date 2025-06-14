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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
/**
 * Database Service that wraps PrismaClient with basic CRUD methods
 *
 * Provides a standardized interface for database operations across all models
 * with proper error handling and connection management.
 */
let DatabaseService = class DatabaseService extends client_1.PrismaClient {
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
            errorFormat: 'pretty',
        });
    }
    /**
     * Initialize database connection
     */
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$connect();
        });
    }
    /**
     * Close database connection
     */
    onModuleDestroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$disconnect();
        });
    }
    /**
     * Generic findMany operation with error handling
     *
     * @param model - The Prisma model to query
     * @param args - Query arguments
     * @returns Promise containing array of records
     */
    findMany(model, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.findMany(args);
            }
            catch (error) {
                this.handleDatabaseError(error, 'findMany');
                throw error;
            }
        });
    }
    /**
     * Generic findUnique operation with error handling
     *
     * @param model - The Prisma model to query
     * @param args - Query arguments with unique identifier
     * @returns Promise containing single record or null
     */
    findUnique(model, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.findUnique(args);
            }
            catch (error) {
                this.handleDatabaseError(error, 'findUnique');
                throw error;
            }
        });
    }
    /**
     * Generic create operation with error handling
     *
     * @param model - The Prisma model to create
     * @param args - Create arguments
     * @returns Promise containing created record
     */
    create(model, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.create(args);
            }
            catch (error) {
                this.handleDatabaseError(error, 'create');
                throw error;
            }
        });
    }
    /**
     * Generic update operation with error handling
     *
     * @param model - The Prisma model to update
     * @param args - Update arguments
     * @returns Promise containing updated record
     */
    update(model, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.update(args);
            }
            catch (error) {
                this.handleDatabaseError(error, 'update');
                throw error;
            }
        });
    }
    /**
     * Generic delete operation with error handling
     *
     * @param model - The Prisma model to delete from
     * @param args - Delete arguments
     * @returns Promise containing deleted record
     */
    delete(model, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.delete(args);
            }
            catch (error) {
                this.handleDatabaseError(error, 'delete');
                throw error;
            }
        });
    }
    /**
     * Generic count operation with error handling
     *
     * @param model - The Prisma model to count
     * @param args - Count arguments
     * @returns Promise containing count
     */
    count(model, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.count(args);
            }
            catch (error) {
                this.handleDatabaseError(error, 'count');
                throw error;
            }
        });
    }
    /**
     * Execute a transaction with multiple operations
     *
     * @param operations - Array of operations to execute in transaction
     * @returns Promise containing transaction result
     */
    executeTransaction(operations) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.$transaction(operations);
            }
            catch (error) {
                this.handleDatabaseError(error, 'transaction');
                throw error;
            }
        });
    }
    /**
     * Execute raw SQL query
     *
     * @param query - Raw SQL query
     * @param values - Query parameters
     * @returns Promise containing query result
     */
    executeRawQuery(query, ...values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use tagged template literal for raw queries
                return yield this.$queryRaw `${query}`;
            }
            catch (error) {
                this.handleDatabaseError(error, 'rawQuery');
                throw error;
            }
        });
    }
    /**
     * Handle database errors with proper logging
     *
     * @param error - The error that occurred
     * @param operation - The operation that failed
     */
    handleDatabaseError(error, operation) {
        var _a, _b;
        console.error(`Database error in ${operation}:`, {
            message: error.message,
            code: error.code,
            meta: error.meta,
            operation,
            timestamp: new Date().toISOString(),
        });
        // Add specific error handling for common Prisma errors
        if (error.code === 'P2002') {
            console.error('Unique constraint violation:', (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target);
        }
        else if (error.code === 'P2025') {
            console.error('Record not found for operation:', operation);
        }
        else if (error.code === 'P2003') {
            console.error('Foreign key constraint violation:', (_b = error.meta) === null || _b === void 0 ? void 0 : _b.field_name);
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
