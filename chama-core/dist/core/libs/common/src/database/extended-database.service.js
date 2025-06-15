"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedDatabaseService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
const prisma_extensions_1 = require("./prisma-extensions");
/**
 * Extended Database Service that adds pagination functionality
 *
 * Extends the base DatabaseService with the paginate method from Prisma extensions,
 * providing a unified interface for both basic CRUD operations and advanced features.
 */
let ExtendedDatabaseService = class ExtendedDatabaseService extends database_service_1.DatabaseService {
    constructor() {
        super(...arguments);
        this.extendedClient = prisma_extensions_1.extendedPrisma;
    }
    /**
     * Paginate results for any model
     *
     * @param modelName - Name of the Prisma model (e.g., 'user', 'chama')
     * @param args - Pagination arguments
     * @returns Promise containing paginated results
     */
    paginate(modelName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the model from the extended client
                const model = this.extendedClient[modelName];
                if (!model) {
                    throw new Error(`Model '${modelName}' not found`);
                }
                // Validate pagination parameters
                this.validatePaginationArgs(args);
                // Use the paginate extension method
                return yield model.paginate(args);
            }
            catch (error) {
                this.handleDatabaseError(error, `paginate-${modelName}`);
                throw error;
            }
        });
    }
    /**
     * Paginate users with filtering and sorting
     *
     * @param args - Pagination arguments
     * @returns Promise containing paginated user results
     */
    paginateUsers(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paginate('user', args);
        });
    }
    /**
     * Paginate chamas with filtering and sorting
     *
     * @param args - Pagination arguments
     * @returns Promise containing paginated chama results
     */
    paginateChamas(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paginate('chama', args);
        });
    }
    /**
     * Paginate contributions with filtering and sorting
     *
     * @param args - Pagination arguments
     * @returns Promise containing paginated contribution results
     */
    paginateContributions(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paginate('contribution', args);
        });
    }
    /**
     * Paginate transactions with filtering and sorting
     *
     * @param args - Pagination arguments
     * @returns Promise containing paginated transaction results
     */
    paginateTransactions(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paginate('transaction', args);
        });
    }
    /**
     * Get paginated results with relationships included
     *
     * @param modelName - Name of the Prisma model
     * @param args - Pagination arguments with include options
     * @returns Promise containing paginated results with relationships
     */
    paginateWithRelations(modelName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const model = this.extendedClient[modelName];
                if (!model) {
                    throw new Error(`Model '${modelName}' not found`);
                }
                this.validatePaginationArgs(args);
                const { include } = args, paginationArgs = __rest(args, ["include"]);
                const { page, perPage, filters, orderBy } = paginationArgs;
                const skip = (page - 1) * perPage;
                const take = perPage;
                // Execute queries with include
                const [items, total] = yield Promise.all([
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
        });
    }
    /**
     * Search and paginate across multiple fields
     *
     * @param modelName - Name of the Prisma model
     * @param searchTerm - Search term to match against
     * @param searchFields - Array of field names to search in
     * @param args - Pagination arguments
     * @returns Promise containing paginated search results
     */
    searchAndPaginate(modelName, searchTerm, searchFields, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Build search filters
                const searchFilters = {
                    OR: searchFields.map(field => ({
                        [field]: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    })),
                };
                // Combine with existing filters if any
                const paginationArgs = Object.assign(Object.assign({}, args), { filters: searchFilters });
                return this.paginate(modelName, paginationArgs);
            }
            catch (error) {
                this.handleDatabaseError(error, `searchAndPaginate-${modelName}`);
                throw error;
            }
        });
    }
    /**
     * Validate pagination arguments
     *
     * @param args - Pagination arguments to validate
     */
    validatePaginationArgs(args) {
        const { page, perPage } = args;
        if (!Number.isInteger(page) || page < 1) {
            throw new Error('Page must be a positive integer');
        }
        if (!Number.isInteger(perPage) || perPage < 1 || perPage > 1000) {
            throw new Error('Items per page must be between 1 and 1000');
        }
    }
    /**
     * Get pagination metadata without fetching data
     *
     * @param modelName - Name of the Prisma model
     * @param filters - Filters to apply
     * @param perPage - Items per page
     * @returns Promise containing pagination metadata
     */
    getPaginationMeta(modelName_1) {
        return __awaiter(this, arguments, void 0, function* (modelName, filters = {}, perPage = 10) {
            try {
                const model = this.extendedClient[modelName];
                if (!model) {
                    throw new Error(`Model '${modelName}' not found`);
                }
                const total = yield model.count({ where: filters });
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
        });
    }
};
exports.ExtendedDatabaseService = ExtendedDatabaseService;
exports.ExtendedDatabaseService = ExtendedDatabaseService = __decorate([
    (0, common_1.Injectable)()
], ExtendedDatabaseService);
