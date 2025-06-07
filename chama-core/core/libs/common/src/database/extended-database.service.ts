import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { extendedPrisma, PaginationArgs, PaginatedResult } from './prisma-extensions';

/**
 * Extended Database Service that adds pagination functionality
 * 
 * Extends the base DatabaseService with the paginate method from Prisma extensions,
 * providing a unified interface for both basic CRUD operations and advanced features.
 */
@Injectable()
export class ExtendedDatabaseService extends DatabaseService {
  private readonly extendedClient = extendedPrisma;

  /**
   * Paginate results for any model
   * 
   * @param modelName - Name of the Prisma model (e.g., 'user', 'chama')
   * @param args - Pagination arguments
   * @returns Promise containing paginated results
   */
  async paginate<T>(
    modelName: string,
    args: PaginationArgs
  ): Promise<PaginatedResult<T>> {
    try {
      // Get the model from the extended client
      const model = (this.extendedClient as any)[modelName];
      
      if (!model) {
        throw new Error(`Model '${modelName}' not found`);
      }

      // Validate pagination parameters
      this.validatePaginationArgs(args);

      // Use the paginate extension method
      return await model.paginate(args);
    } catch (error) {
      this.handleDatabaseError(error, `paginate-${modelName}`);
      throw error;
    }
  }

  /**
   * Paginate users with filtering and sorting
   * 
   * @param args - Pagination arguments
   * @returns Promise containing paginated user results
   */
  async paginateUsers(args: PaginationArgs): Promise<PaginatedResult<any>> {
    return this.paginate('user', args);
  }

  /**
   * Paginate chamas with filtering and sorting
   * 
   * @param args - Pagination arguments
   * @returns Promise containing paginated chama results
   */
  async paginateChamas(args: PaginationArgs): Promise<PaginatedResult<any>> {
    return this.paginate('chama', args);
  }

  /**
   * Paginate contributions with filtering and sorting
   * 
   * @param args - Pagination arguments
   * @returns Promise containing paginated contribution results
   */
  async paginateContributions(args: PaginationArgs): Promise<PaginatedResult<any>> {
    return this.paginate('contribution', args);
  }

  /**
   * Paginate transactions with filtering and sorting
   * 
   * @param args - Pagination arguments
   * @returns Promise containing paginated transaction results
   */
  async paginateTransactions(args: PaginationArgs): Promise<PaginatedResult<any>> {
    return this.paginate('transaction', args);
  }

  /**
   * Get paginated results with relationships included
   * 
   * @param modelName - Name of the Prisma model
   * @param args - Pagination arguments with include options
   * @returns Promise containing paginated results with relationships
   */
  async paginateWithRelations<T>(
    modelName: string,
    args: PaginationArgs & { include?: any }
  ): Promise<PaginatedResult<T>> {
    try {
      const model = (this.extendedClient as any)[modelName];
      
      if (!model) {
        throw new Error(`Model '${modelName}' not found`);
      }

      this.validatePaginationArgs(args);

      const { include, ...paginationArgs } = args;
      const { page, perPage, filters, orderBy } = paginationArgs;
      const skip = (page - 1) * perPage;
      const take = perPage;

      // Execute queries with include
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
    } catch (error) {
      this.handleDatabaseError(error, `paginateWithRelations-${modelName}`);
      throw error;
    }
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
  async searchAndPaginate<T>(
    modelName: string,
    searchTerm: string,
    searchFields: string[],
    args: Omit<PaginationArgs, 'filters'>
  ): Promise<PaginatedResult<T>> {
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
      const paginationArgs: PaginationArgs = {
        ...args,
        filters: searchFilters,
      };

      return this.paginate(modelName, paginationArgs);
    } catch (error) {
      this.handleDatabaseError(error, `searchAndPaginate-${modelName}`);
      throw error;
    }
  }

  /**
   * Validate pagination arguments
   * 
   * @param args - Pagination arguments to validate
   */
  private validatePaginationArgs(args: PaginationArgs): void {
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
  async getPaginationMeta(
    modelName: string,
    filters: any = {},
    perPage: number = 10
  ): Promise<{
    total: number;
    totalPages: number;
    perPage: number;
  }> {
    try {
      const model = (this.extendedClient as any)[modelName];
      
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
    } catch (error) {
      this.handleDatabaseError(error, `getPaginationMeta-${modelName}`);
      throw error;
    }
  }
}

