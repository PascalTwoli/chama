/**
 * Main database layer exports
 * 
 * This file provides a centralized entry point for all database-related
 * functionality including models, entities, services, and utilities.
 */

// Models and types
export * from './models';

// Entities
export * from './entities';

// Services
export { DatabaseService, type CrudOperations } from './database.service';
export { ExtendedDatabaseService } from './extended-database.service';

// Prisma extensions
export {
  extendedPrisma,
  type ExtendedPrismaClient,
  type PaginationArgs,
  type PaginatedResult,
} from './prisma-extensions';

// DTOs
export {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  DtoValidationUtils,
} from './dtos/create-user.dto';

