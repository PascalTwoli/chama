import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaDto } from './dto/create-chama.dto';
export declare class ChamaService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createChamaDto: CreateChamaDto, userId: string): Promise<{
        memberships: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            chamaId: string;
            joinedAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        rules: string | null;
        userId: string;
    }>;
    findAll(userId: string): Promise<({
        memberships: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            chamaId: string;
            joinedAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        rules: string | null;
        userId: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        memberships: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            chamaId: string;
            joinedAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        rules: string | null;
        userId: string;
    }>;
}
