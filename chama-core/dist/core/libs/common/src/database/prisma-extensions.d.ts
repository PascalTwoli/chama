import { Prisma } from '@prisma/client';
export interface PaginationArgs {
    page: number;
    perPage: number;
    filters?: Record<string, any>;
    orderBy?: Record<string, 'asc' | 'desc'>;
}
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export declare const extendedPrisma: import("@prisma/client/runtime/library").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {
        $allModels: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        user: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        chama: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        membership: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        invite: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        contribution: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        payment: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        notificationType: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        notification: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        uiSettings: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        transaction: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
    };
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<Prisma.PrismaClientOptions>, {
    result: {};
    model: {
        $allModels: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        user: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        chama: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        membership: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        invite: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        contribution: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        payment: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        notificationType: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        notification: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        uiSettings: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
        transaction: {
            paginate: () => <T>(this: T, args: PaginationArgs) => Promise<PaginatedResult<Prisma.Result<T, any, "findMany">>>;
        };
    };
    query: {};
    client: {};
}>;
export type ExtendedPrismaClient = typeof extendedPrisma;
export default extendedPrisma;
