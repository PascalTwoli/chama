"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedDatabaseService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
const prisma_extensions_1 = require("./prisma-extensions");
let ExtendedDatabaseService = class ExtendedDatabaseService extends database_service_1.DatabaseService {
    extendedClient = prisma_extensions_1.extendedPrisma;
    async paginate(modelName, args) {
        try {
            const model = this.extendedClient[modelName];
            if (!model) {
                throw new Error(`Model '${modelName}' not found`);
            }
            this.validatePaginationArgs(args);
            return await model.paginate(args);
        }
        catch (error) {
            this.handleDatabaseError(error, `paginate-${modelName}`);
            throw error;
        }
    }
    async paginateUsers(args) {
        return this.paginate('user', args);
    }
    async paginateChamas(args) {
        return this.paginate('chama', args);
    }
    async paginateContributions(args) {
        return this.paginate('contribution', args);
    }
    async paginateTransactions(args) {
        return this.paginate('transaction', args);
    }
    async paginateWithRelations(modelName, args) {
        try {
            const model = this.extendedClient[modelName];
            if (!model) {
                throw new Error(`Model '${modelName}' not found`);
            }
            this.validatePaginationArgs(args);
            const { include, ...paginationArgs } = args;
            const { page, perPage, filters, orderBy } = paginationArgs;
            const skip = (page - 1) * perPage;
            const take = perPage;
            const [items, total] = await Promise.all([
                model.findMany({
                    where: filters,
                    orderBy,
                    skip,
                    take,
                    include,
                }),
                model.count({ where: filters }),
            ]);
            const totalPages = Math.ceil(total / perPage);
            const hasNext = page < totalPages;
            const hasPrevious = page > 1;
            return {
                items,
                total,
                page,
                perPage,
                totalPages,
                hasNext,
                hasPrevious,
            };
        }
        catch (error) {
            this.handleDatabaseError(error, `paginateWithRelations-${modelName}`);
            throw error;
        }
    }
    async searchAndPaginate(modelName, searchTerm, searchFields, args) {
        try {
            const searchFilters = {
                OR: searchFields.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                })),
            };
            const paginationArgs = {
                ...args,
                filters: searchFilters,
            };
            return this.paginate(modelName, paginationArgs);
        }
        catch (error) {
            this.handleDatabaseError(error, `searchAndPaginate-${modelName}`);
            throw error;
        }
    }
    validatePaginationArgs(args) {
        const { page, perPage } = args;
        if (!Number.isInteger(page) || page < 1) {
            throw new Error('Page must be a positive integer');
        }
        if (!Number.isInteger(perPage) || perPage < 1 || perPage > 1000) {
            throw new Error('Items per page must be between 1 and 1000');
        }
    }
    async getPaginationMeta(modelName, filters = {}, perPage = 10) {
        try {
            const model = this.extendedClient[modelName];
            if (!model) {
                throw new Error(`Model '${modelName}' not found`);
            }
            const total = await model.count({ where: filters });
            const totalPages = Math.ceil(total / perPage);
            return {
                total,
                totalPages,
                perPage,
            };
        }
        catch (error) {
            this.handleDatabaseError(error, `getPaginationMeta-${modelName}`);
            throw error;
        }
    }
};
exports.ExtendedDatabaseService = ExtendedDatabaseService;
exports.ExtendedDatabaseService = ExtendedDatabaseService = __decorate([
    (0, common_1.Injectable)()
], ExtendedDatabaseService);
//# sourceMappingURL=extended-database.service.js.map