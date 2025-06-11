"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChamaService = class ChamaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createChamaDto, userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            const chama = await this.prisma.chama.create({
                data: {
                    name: createChamaDto.name,
                    description: createChamaDto.description,
                    userId: user.id,
                    memberships: {
                        create: {
                            userId: user.id,
                            role: 'ADMIN',
                        },
                    },
                },
                include: {
                    memberships: true,
                },
            });
            return chama;
        }
        catch (error) {
            console.error('Error creating chama:', error);
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('A chama with this name already exists');
            }
            throw new common_1.BadRequestException(`Failed to create chama: ${error.message}`);
        }
    }
    async findAll(userId) {
        try {
            const chamas = await this.prisma.chama.findMany({
                where: {
                    memberships: {
                        some: { userId },
                    },
                },
                include: {
                    memberships: true,
                },
            });
            return chamas;
        }
        catch (error) {
            console.error('Error finding chamas:', error);
            throw new common_1.BadRequestException(`Failed to fetch chamas: ${error.message}`);
        }
    }
    async findOne(id, userId) {
        try {
            const chama = await this.prisma.chama.findFirst({
                where: {
                    id,
                    memberships: {
                        some: { userId },
                    },
                },
                include: {
                    memberships: true,
                },
            });
            if (!chama) {
                throw new common_1.NotFoundException(`Chama with ID ${id} not found or you don't have access`);
            }
            return chama;
        }
        catch (error) {
            console.error(`Error finding chama with ID ${id}:`, error);
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException(`Failed to fetch chama: ${error.message}`);
        }
    }
};
exports.ChamaService = ChamaService;
exports.ChamaService = ChamaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChamaService);
//# sourceMappingURL=chama.service.js.map