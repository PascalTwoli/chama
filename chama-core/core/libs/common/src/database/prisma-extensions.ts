import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Interface for pagination arguments
 */
export interface PaginationArgs {
  page: number;
  perPage: number;
  filters?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

/**
 * Interface for paginated results
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

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
export const extendedPrisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      /**
       * Paginate query results with filtering and sorting
       *
       * @param args - Pagination arguments including page, perPage, filters, and orderBy
       * @returns Promise containing paginated results with metadata
       */
      async paginate<T>(
        this: T,
        args: PaginationArgs,
      ): Promise<PaginatedResult<Prisma.Result<T, any, 'findMany'>>> {
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
        const [items, total] = await Promise.all([
          (this as any).findMany(queryOptions),
          (this as any).count({ where: filters }),
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

/**
 * Type for the extended Prisma client
 */
export type ExtendedPrismaClient = typeof extendedPrisma;

/**
 * Export the extended client instance
 */
export default extendedPrisma;
