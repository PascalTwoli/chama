'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.extendedPrisma = void 0;
const client_1 = require('@prisma/client');
/**
 * Extended Prisma Client with pagination functionality
 *
 * This extension adds a `paginate` method to all Prisma models
 * that provides consistent pagination across the application.
 *
 * @example
 * ```typescript
 * const result = await extendedPrisma.user.paginate({
 *   page: 1,
 *   perPage: 10,
 *   filters: { role: 'ADMIN' },
 *   orderBy: { createdAt: 'desc' }
 * });
 * ```
 */
exports.extendedPrisma = new client_1.PrismaClient().$extends({
  model: {
    $allModels: {
      /**
       * Paginate query results with filtering and sorting
       *
       * @param args - Pagination arguments including page, perPage, filters, and orderBy
       * @returns Promise containing paginated results with metadata
       */
      paginate(args) {
        return __awaiter(this, void 0, void 0, function* () {
          const { page, perPage, filters = {}, orderBy = {} } = args;
          // Validate pagination parameters
          if (page < 1) {
            throw new Error('Page number must be greater than 0');
          }
          if (perPage < 1 || perPage > 1000) {
            throw new Error('Items per page must be between 1 and 1000');
          }
          const skip = (page - 1) * perPage;
          const take = perPage;
          // Build query options
          const queryOptions = {
            where: filters,
            orderBy,
            skip,
            take,
          };
          // Execute queries in parallel for better performance
          const [items, total] = yield Promise.all([
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
        });
      },
    },
  },
});
/**
 * Export the extended client instance
 */
exports.default = exports.extendedPrisma;
