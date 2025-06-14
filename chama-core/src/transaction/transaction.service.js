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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TransactionService = class TransactionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Creates a new financial transaction
     * @param createTransactionDto - Transaction data
     * @param userId - ID of the user creating the transaction
     * @returns The created transaction
     */
    createTransaction(createTransactionDto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, verify the user is a member of the chama
            const membership = yield this.prisma.membership.findFirst({
                where: {
                    chamaId: createTransactionDto.chamaId,
                    userId: userId,
                },
            });
            if (!membership) {
                throw new common_1.ForbiddenException('You are not a member of this chama');
            }
            // Verify the chama exists
            const chama = yield this.prisma.chama.findUnique({
                where: { id: createTransactionDto.chamaId },
            });
            if (!chama) {
                throw new common_1.NotFoundException(`Chama with ID ${createTransactionDto.chamaId} not found`);
            }
            // Create the transaction
            try {
                const transaction = yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    return yield prisma.transaction.create({
                        data: {
                            type: createTransactionDto.type,
                            amount: createTransactionDto.amount,
                            chamaId: createTransactionDto.chamaId,
                            userId: userId,
                            description: createTransactionDto.description,
                            reference: createTransactionDto.reference,
                            status: 'COMPLETED', // Default status
                        },
                    });
                }));
                // Convert Decimal amount to number and null to undefined for response
                return Object.assign(Object.assign({}, transaction), { amount: Number(transaction.amount), description: transaction.description || undefined, reference: transaction.reference || undefined });
            }
            catch (error) {
                throw new common_1.BadRequestException(`Failed to create transaction: ${error.message}`);
            }
        });
    }
    /**
     * Gets all transactions for a specific chama
     * @param chamaId - ID of the chama
     * @param userId - ID of the user requesting transactions
     * @param type - Optional filter by transaction type
     * @param startDate - Optional filter by start date
     * @param endDate - Optional filter by end date
     * @returns List of transactions
     */
    getTransactionsByChama(chamaId, userId, type, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify the user is a member of the chama
            const membership = yield this.prisma.membership.findFirst({
                where: {
                    chamaId: chamaId,
                    userId: userId,
                },
            });
            if (!membership) {
                throw new common_1.ForbiddenException('You are not a member of this chama');
            }
            // Verify the chama exists
            const chama = yield this.prisma.chama.findUnique({
                where: { id: chamaId },
            });
            if (!chama) {
                throw new common_1.NotFoundException(`Chama with ID ${chamaId} not found`);
            }
            // Build the where clause based on filters
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
            // Get transactions
            const transactions = yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.transaction.findMany({
                    where,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
            }));
            // Convert Decimal amounts to numbers and null to undefined for response
            return transactions.map(transaction => (Object.assign(Object.assign({}, transaction), { amount: Number(transaction.amount), description: transaction.description || undefined, reference: transaction.reference || undefined })));
        });
    }
    /**
     * Gets a specific transaction by ID
     * @param id - Transaction ID
     * @param userId - ID of the user requesting the transaction
     * @returns Transaction details
     */
    getTransactionById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.prisma.transaction.findUnique({
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
            // Verify the user is a member of the chama or created the transaction
            const isMember = transaction.chama.memberships.some((membership) => membership.userId === userId);
            const isCreator = transaction.userId === userId;
            if (!isMember && !isCreator) {
                throw new common_1.ForbiddenException('You do not have permission to view this transaction');
            }
            // Exclude nested data before returning and convert Decimal to number
            const { chama } = transaction, transactionData = __rest(transaction, ["chama"]);
            return Object.assign(Object.assign({}, transactionData), { amount: Number(transactionData.amount), description: transactionData.description || undefined, reference: transactionData.reference || undefined });
        });
    }
    /**
     * Gets a summary of transactions for a user
     * @param userId - ID of the user
     * @returns Transaction summary
     */
    getUserTransactionSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all chamas the user is a member of
            const memberships = yield this.prisma.membership.findMany({
                where: { userId },
                include: {
                    chama: true,
                },
            });
            const chamaIds = memberships.map((membership) => membership.chamaId);
            // Get all transactions for these chamas where the user is involved
            const transactions = yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.transaction.findMany({
                    where: {
                        chamaId: { in: chamaIds },
                        userId,
                    },
                });
            }));
            // Calculate totals
            let totalContributions = 0;
            let totalWithdrawals = 0;
            let totalLoans = 0;
            let totalRepayments = 0;
            // Group by chama for chama-specific stats
            const chamaStatMap = new Map();
            transactions.forEach((transaction) => {
                var _a;
                // Update overall totals
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
                // Update chama-specific stats
                if (!chamaStatMap.has(transaction.chamaId)) {
                    const chama = (_a = memberships.find((m) => m.chamaId === transaction.chamaId)) === null || _a === void 0 ? void 0 : _a.chama;
                    chamaStatMap.set(transaction.chamaId, {
                        chamaId: transaction.chamaId,
                        chamaName: (chama === null || chama === void 0 ? void 0 : chama.name) || 'Unknown Chama',
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
        });
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
