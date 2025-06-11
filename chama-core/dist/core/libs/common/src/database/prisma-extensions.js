"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendedPrisma = void 0;
const client_1 = require("@prisma/client");
exports.extendedPrisma = new client_1.PrismaClient().$extends({
    model: {
        $allModels: {
            async paginate(args) {
                const { page, perPage, filters = {}, orderBy = {} } = args;
                if (page < 1) {
                    throw new Error('Page number must be greater than 0');
                }
                if (perPage < 1 || perPage > 1000) {
                    throw new Error('Items per page must be between 1 and 1000');
                }
                const skip = (page - 1) * perPage;
                const take = perPage;
                const queryOptions = {
                    where: filters,
                    orderBy,
                    skip,
                    take,
                };
                const [items, total] = await Promise.all([
                    this.findMany(queryOptions),
                    this.count({ where: filters }),
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
            },
        },
    },
});
exports.default = exports.extendedPrisma;
//# sourceMappingURL=prisma-extensions.js.map