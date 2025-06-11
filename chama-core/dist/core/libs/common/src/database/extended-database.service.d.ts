import { DatabaseService } from './database.service';
import { PaginationArgs, PaginatedResult } from './prisma-extensions';
export declare class ExtendedDatabaseService extends DatabaseService {
    private readonly extendedClient;
    paginate<T>(modelName: string, args: PaginationArgs): Promise<PaginatedResult<T>>;
    paginateUsers(args: PaginationArgs): Promise<PaginatedResult<any>>;
    paginateChamas(args: PaginationArgs): Promise<PaginatedResult<any>>;
    paginateContributions(args: PaginationArgs): Promise<PaginatedResult<any>>;
    paginateTransactions(args: PaginationArgs): Promise<PaginatedResult<any>>;
    paginateWithRelations<T>(modelName: string, args: PaginationArgs & {
        include?: any;
    }): Promise<PaginatedResult<T>>;
    searchAndPaginate<T>(modelName: string, searchTerm: string, searchFields: string[], args: Omit<PaginationArgs, 'filters'>): Promise<PaginatedResult<T>>;
    private validatePaginationArgs;
    getPaginationMeta(modelName: string, filters?: any, perPage?: number): Promise<{
        total: number;
        totalPages: number;
        perPage: number;
    }>;
}
