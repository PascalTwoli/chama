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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ChamaService = class ChamaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createChamaDto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify user exists
                const user = yield this.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    throw new common_1.NotFoundException(`User with ID ${userId} not found`);
                }
                // Create the chama
                const chama = yield this.prisma.chama.create({
                    data: {
                        name: createChamaDto.name,
                        description: createChamaDto.description,
                        rules: createChamaDto.rules,
                        userId: user.id,
                        country: createChamaDto.country || client_1.Countries.KENYA, // Use provided country or default to KENYA
                        membersCount: createChamaDto.membersCount || 1, // Use provided count or default to 1
                        organizationRole: createChamaDto.organizationRole,
                        memberships: {
                            create: {
                                userId: user.id,
                                role: client_1.UserRole.CHAIRPERSON, // Creator is chairperson
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
                const errorWithCode = error;
                if (errorWithCode.code === 'P2002') {
                    throw new common_1.BadRequestException('A chama with this name already exists');
                }
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to create chama: ${message}`);
            }
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chamas = yield this.prisma.chama.findMany({
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
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to fetch chamas: ${message}`);
            }
        });
    }
    findAllAvailable(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all chamas that the user is NOT already a member of
                const chamas = yield this.prisma.chama.findMany({
                    where: {
                        NOT: {
                            memberships: {
                                some: { userId },
                            },
                        },
                    },
                    include: {
                        memberships: true,
                    },
                });
                return chamas;
            }
            catch (error) {
                console.error('Error finding available chamas:', error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to fetch available chamas: ${message}`);
            }
        });
    }
    findOne(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chama = yield this.prisma.chama.findFirst({
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
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new common_1.BadRequestException(`Failed to fetch chama: ${message}`);
            }
        });
    }
};
exports.ChamaService = ChamaService;
exports.ChamaService = ChamaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChamaService);
