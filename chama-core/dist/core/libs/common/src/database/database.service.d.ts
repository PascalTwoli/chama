import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
export interface CrudOperations<T, CreateInput, UpdateInput, WhereInput, WhereUniqueInput> {
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
    create(args: {
        data: CreateInput;
        include?: any;
    }): Promise<T>;
    update(args: {
        where: WhereUniqueInput;
        data: UpdateInput;
        include?: any;
    }): Promise<T>;
    delete(args: {
        where: WhereUniqueInput;
    }): Promise<T>;
    count(args?: {
        where?: WhereInput;
    }): Promise<number>;
}
export declare class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    findMany<T>(model: any, args?: {
        where?: any;
        orderBy?: any;
        skip?: number;
        take?: number;
        include?: any;
    }): Promise<T[]>;
    findUnique<T>(model: any, args: {
        where: any;
        include?: any;
    }): Promise<T | null>;
    create<T>(model: any, args: {
        data: any;
        include?: any;
    }): Promise<T>;
    update<T>(model: any, args: {
        where: any;
        data: any;
        include?: any;
    }): Promise<T>;
    delete<T>(model: any, args: {
        where: any;
    }): Promise<T>;
    count(model: any, args?: {
        where?: any;
    }): Promise<number>;
    executeTransaction<T>(operations: Prisma.PrismaPromise<any>[]): Promise<T[]>;
    executeRawQuery<T = any>(query: string, ...values: any[]): Promise<T[]>;
    protected handleDatabaseError(error: any, operation: string): void;
}
