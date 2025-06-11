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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let DatabaseService = class DatabaseService extends client_1.PrismaClient {
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
            errorFormat: 'pretty',
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async findMany(model, args) {
        try {
            return await model.findMany(args);
        }
        catch (error) {
            this.handleDatabaseError(error, 'findMany');
            throw error;
        }
    }
    async findUnique(model, args) {
        try {
            return await model.findUnique(args);
        }
        catch (error) {
            this.handleDatabaseError(error, 'findUnique');
            throw error;
        }
    }
    async create(model, args) {
        try {
            return await model.create(args);
        }
        catch (error) {
            this.handleDatabaseError(error, 'create');
            throw error;
        }
    }
    async update(model, args) {
        try {
            return await model.update(args);
        }
        catch (error) {
            this.handleDatabaseError(error, 'update');
            throw error;
        }
    }
    async delete(model, args) {
        try {
            return await model.delete(args);
        }
        catch (error) {
            this.handleDatabaseError(error, 'delete');
            throw error;
        }
    }
    async count(model, args) {
        try {
            return await model.count(args);
        }
        catch (error) {
            this.handleDatabaseError(error, 'count');
            throw error;
        }
    }
    async executeTransaction(operations) {
        try {
            return await this.$transaction(operations);
        }
        catch (error) {
            this.handleDatabaseError(error, 'transaction');
            throw error;
        }
    }
    async executeRawQuery(query, ...values) {
        try {
            return await this.$queryRaw `${query}`;
        }
        catch (error) {
            this.handleDatabaseError(error, 'rawQuery');
            throw error;
        }
    }
    handleDatabaseError(error, operation) {
        console.error(`Database error in ${operation}:`, {
            message: error.message,
            code: error.code,
            meta: error.meta,
            operation,
            timestamp: new Date().toISOString(),
        });
        if (error.code === 'P2002') {
            console.error('Unique constraint violation:', error.meta?.target);
        }
        else if (error.code === 'P2025') {
            console.error('Record not found for operation:', operation);
        }
        else if (error.code === 'P2003') {
            console.error('Foreign key constraint violation:', error.meta?.field_name);
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
//# sourceMappingURL=database.service.js.map