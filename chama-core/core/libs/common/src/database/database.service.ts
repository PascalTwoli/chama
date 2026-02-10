import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Generic interface for CRUD operations
 */
export interface CrudOperations<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  WhereUniqueInput,
> {
  findMany(args?: {
    where?: WhereInput;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<T[]>;
  findUnique(args: {
    where: WhereUniqueInput;
    include?: any;
  }): Promise<T | null>;
  create(args: { data: CreateInput; include?: any }): Promise<T>;
  update(args: {
    where: WhereUniqueInput;
    data: UpdateInput;
    include?: any;
  }): Promise<T>;
  delete(args: { where: WhereUniqueInput }): Promise<T>;
  count(args?: { where?: WhereInput }): Promise<number>;
}

/**
 * Database Service that wraps PrismaClient with basic CRUD methods
 *
 * Provides a standardized interface for database operations across all models
 * with proper error handling and connection management.
 */
@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  /**
   * Initialize database connection
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Close database connection
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Generic findMany operation with error handling
   *
   * @param model - The Prisma model to query
   * @param args - Query arguments
   * @returns Promise containing array of records
   */
  async findMany<T>(
    model: any,
    args?: {
      where?: any;
      orderBy?: any;
      skip?: number;
      take?: number;
      include?: any;
    },
  ): Promise<T[]> {
    try {
      return await model.findMany(args);
    } catch (error) {
      this.handleDatabaseError(error, 'findMany');
      throw error;
    }
  }

  /**
   * Generic findUnique operation with error handling
   *
   * @param model - The Prisma model to query
   * @param args - Query arguments with unique identifier
   * @returns Promise containing single record or null
   */
  async findUnique<T>(
    model: any,
    args: { where: any; include?: any },
  ): Promise<T | null> {
    try {
      return await model.findUnique(args);
    } catch (error) {
      this.handleDatabaseError(error, 'findUnique');
      throw error;
    }
  }

  /**
   * Generic create operation with error handling
   *
   * @param model - The Prisma model to create
   * @param args - Create arguments
   * @returns Promise containing created record
   */
  async create<T>(model: any, args: { data: any; include?: any }): Promise<T> {
    try {
      return await model.create(args);
    } catch (error) {
      this.handleDatabaseError(error, 'create');
      throw error;
    }
  }

  /**
   * Generic update operation with error handling
   *
   * @param model - The Prisma model to update
   * @param args - Update arguments
   * @returns Promise containing updated record
   */
  async update<T>(
    model: any,
    args: { where: any; data: any; include?: any },
  ): Promise<T> {
    try {
      return await model.update(args);
    } catch (error) {
      this.handleDatabaseError(error, 'update');
      throw error;
    }
  }

  /**
   * Generic delete operation with error handling
   *
   * @param model - The Prisma model to delete from
   * @param args - Delete arguments
   * @returns Promise containing deleted record
   */
  async delete<T>(model: any, args: { where: any }): Promise<T> {
    try {
      return await model.delete(args);
    } catch (error) {
      this.handleDatabaseError(error, 'delete');
      throw error;
    }
  }

  /**
   * Generic count operation with error handling
   *
   * @param model - The Prisma model to count
   * @param args - Count arguments
   * @returns Promise containing count
   */
  async count(model: any, args?: { where?: any }): Promise<number> {
    try {
      return await model.count(args);
    } catch (error) {
      this.handleDatabaseError(error, 'count');
      throw error;
    }
  }

  /**
   * Execute a transaction with multiple operations
   *
   * @param operations - Array of operations to execute in transaction
   * @returns Promise containing transaction result
   */
  async executeTransaction<T>(
    operations: Prisma.PrismaPromise<any>[],
  ): Promise<T[]> {
    try {
      return await this.$transaction(operations);
    } catch (error) {
      this.handleDatabaseError(error, 'transaction');
      throw error;
    }
  }

  /**
   * Execute raw SQL query
   *
   * @param query - Raw SQL query
   * @param values - Query parameters
   * @returns Promise containing query result
   */
  async executeRawQuery<T = any>(
    query: string,
    ...values: any[]
  ): Promise<T[]> {
    try {
      // Use tagged template literal for raw queries
      return await this.$queryRaw`${query}`;
    } catch (error) {
      this.handleDatabaseError(error, 'rawQuery');
      throw error;
    }
  }

  /**
   * Handle database errors with proper logging
   *
   * @param error - The error that occurred
   * @param operation - The operation that failed
   */
  protected handleDatabaseError(error: any, operation: string): void {
    console.error(`Database error in ${operation}:`, {
      message: error.message,
      code: error.code,
      meta: error.meta,
      operation,
      timestamp: new Date().toISOString(),
    });

    // Add specific error handling for common Prisma errors
    if (error.code === 'P2002') {
      console.error('Unique constraint violation:', error.meta?.target);
    } else if (error.code === 'P2025') {
      console.error('Record not found for operation:', operation);
    } else if (error.code === 'P2003') {
      console.error(
        'Foreign key constraint violation:',
        error.meta?.field_name,
      );
    }
  }
}
