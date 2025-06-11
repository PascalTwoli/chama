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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TransactionService = class TransactionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(createTransactionDto, userId) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                chamaId: createTransactionDto.chamaId,
                userId: userId,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this chama');
        }
        const chama = await this.prisma.chama.findUnique({
            where: { id: createTransactionDto.chamaId },
        });
        if (!chama) {
            throw new common_1.NotFoundException(`Chama with ID ${createTransactionDto.chamaId} not found`);
        }
        try {
            const transaction = await this.prisma.$transaction(async (prisma) => {
                return await prisma.transaction.create({
                    data: {
                        type: createTransactionDto.type,
                        amount: createTransactionDto.amount,
                        chamaId: createTransactionDto.chamaId,
                        userId: userId,
                        description: createTransactionDto.description,
                        reference: createTransactionDto.reference,
                        status: 'COMPLETED',
                    },
                });
            });
            return {
                ...transaction,
                amount: Number(transaction.amount),
                description: transaction.description || undefined,
                reference: transaction.reference || undefined
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create transaction: ${error.message}`);
        }
    }
    async getTransactionsByChama(chamaId, userId, type, startDate, endDate) {
        const membership = await this.prisma.membership.findFirst({
            where: {
                chamaId: chamaId,
                userId: userId,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this chama');
        }
        const chama = await this.prisma.chama.findUnique({
            where: { id: chamaId },
        });
        if (!chama) {
            throw new common_1.NotFoundException(`Chama with ID ${chamaId} not found`);
        }
        const where = {
            chamaId: chamaId,
        };
        if (type) {
            where.type = type;
        }
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        else if (startDate) {
            where.createdAt = {
                gte: new Date(startDate),
            };
        }
        else if (endDate) {
            where.createdAt = {
                lte: new Date(endDate),
            };
        }
        const transactions = await this.prisma.$transaction(async (prisma) => {
            return await prisma.transaction.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
        return transactions.map(transaction => ({
            ...transaction,
            amount: Number(transaction.amount),
            description: transaction.description || undefined,
            reference: transaction.reference || undefined
        }));
    }
    async getTransactionById(id, userId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                chama: {
                    include: {
                        memberships: true,
                    },
                },
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        const isMember = transaction.chama.memberships.some((membership) => membership.userId === userId);
        const isCreator = transaction.userId === userId;
        if (!isMember && !isCreator) {
            throw new common_1.ForbiddenException('You do not have permission to view this transaction');
        }
        const { chama, ...transactionData } = transaction;
        return {
            ...transactionData,
            amount: Number(transactionData.amount),
            description: transactionData.description || undefined,
            reference: transactionData.reference || undefined
        };
    }
    async getUserTransactionSummary(userId) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: {
                chama: true,
            },
        });
        const chamaIds = memberships.map((membership) => membership.chamaId);
        const transactions = await this.prisma.$transaction(async (prisma) => {
            return await prisma.transaction.findMany({
                where: {
                    chamaId: { in: chamaIds },
                    userId,
                },
            });
        });
        let totalContributions = 0;
        let totalWithdrawals = 0;
        let totalLoans = 0;
        let totalRepayments = 0;
        const chamaStatMap = new Map();
        transactions.forEach((transaction) => {
            if (transaction.type === client_1.TransactionType.CONTRIBUTION) {
                totalContributions += transaction.amount.toNumber();
            }
            else if (transaction.type === client_1.TransactionType.WITHDRAWAL) {
                totalWithdrawals += transaction.amount.toNumber();
            }
            else if (transaction.type === client_1.TransactionType.LOAN) {
                totalLoans += transaction.amount.toNumber();
            }
            else if (transaction.type === client_1.TransactionType.LOAN_REPAYMENT) {
                totalRepayments += transaction.amount.toNumber();
            }
            if (!chamaStatMap.has(transaction.chamaId)) {
                const chama = memberships.find((m) => m.chamaId === transaction.chamaId)?.chama;
                chamaStatMap.set(transaction.chamaId, {
                    chamaId: transaction.chamaId,
                    chamaName: chama?.name || 'Unknown Chama',
                    contributions: 0,
                    withdrawals: 0,
                    loans: 0,
                    repayments: 0,
                });
            }
            const chamaStat = chamaStatMap.get(transaction.chamaId);
            if (transaction.type === client_1.TransactionType.CONTRIBUTION) {
                chamaStat.contributions += transaction.amount.toNumber();
            }
            else if (transaction.type === client_1.TransactionType.WITHDRAWAL) {
                chamaStat.withdrawals += transaction.amount.toNumber();
            }
            else if (transaction.type === client_1.TransactionType.LOAN) {
                chamaStat.loans += transaction.amount.toNumber();
            }
            else if (transaction.type === client_1.TransactionType.LOAN_REPAYMENT) {
                chamaStat.repayments += transaction.amount.toNumber();
            }
        });
        return {
            totalContributions,
            totalWithdrawals,
            totalLoans,
            totalRepayments,
            chamaStats: Array.from(chamaStatMap.values()),
        };
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map