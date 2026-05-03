import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  expense,
  expense_category,
  PaymentMethod,
  ExpenseStatus,
  Prisma,
} from '@prisma/client';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { v4 as uuid } from 'uuid';

interface ExpenseWithCategory extends expense {
  category: expense_category;
}

@Injectable()
export class ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a reference code in format EXP-YYYY-XXX
   * Sequence resets every year
   */
  async generateReferenceCode(chamaId: string): Promise<string> {
    const year = new Date().getFullYear();
    const yearStart = new Date(`${year}-01-01`);

    // Count expenses created this year in this chama
    const count = await this.prisma.expense.count({
      where: {
        chamaId,
        createdAt: {
          gte: yearStart,
        },
      },
    });

    const sequence = String(count + 1).padStart(3, '0');
    return `EXP-${year}-${sequence}`;
  }

  /**
   * Create a new expense
   */
  async create(
    data: CreateExpenseDto,
    userId: string,
  ): Promise<ExpenseWithCategory> {
    // Verify category exists and belongs to the chama or is global
    const category = await this.prisma.expense_category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (category.chama_id && category.chama_id !== data.chamaId) {
      throw new BadRequestException('Category does not belong to this chama');
    }

    // Generate reference code
    const referenceCode = await this.generateReferenceCode(data.chamaId);

    return this.prisma.expense.create({
      data: {
        id: uuid(),
        referenceCode,
        chamaId: data.chamaId,
        description: data.description,
        amount: parseFloat(data.amount),
        categoryId: data.categoryId,
        paidTo: data.paidTo,
        paymentMethod: data.paymentMethod as PaymentMethod,
        referenceNumber: data.referenceNumber || null,
        expenseDate: new Date(data.expenseDate),
        notes: data.notes || null,
        attachmentUrl: data.attachmentUrl || null,
        createdBy: userId,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Get paginated expenses for a chama with filters
   */
  async findMany(
    chamaId: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      categoryId?: string;
      dateFrom?: string;
      dateTo?: string;
      paymentMethod?: string;
      status?: string;
    },
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.expenseWhereInput = { chamaId };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.expenseDate = {
        ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
        ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
      };
    }

    if (filters?.paymentMethod) {
      where.paymentMethod = filters.paymentMethod as PaymentMethod;
    }

    if (filters?.status) {
      where.status = filters.status as ExpenseStatus;
    }

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: {
          category: true,
          approver: {
            include: {
              member_roles: {
                include: {
                  role: true,
                },
              },
            },
          },
          rejector: {
            include: {
              member_roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
        orderBy: {
          expenseDate: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single expense by ID
   */
  async findById(
    id: string,
    chamaId: string,
  ): Promise<ExpenseWithCategory | null> {
    return this.prisma.expense.findFirst({
      where: {
        id,
        chamaId,
      },
      include: {
        category: true,
        approver: {
          include: {
            member_roles: {
              include: {
                role: true,
              },
            },
          },
        },
        rejector: {
          include: {
            member_roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update an expense
   */
  async update(
    id: string,
    chamaId: string,
    data: UpdateExpenseDto,
  ): Promise<ExpenseWithCategory> {
    // Verify expense exists and belongs to chama
    const expense = await this.findById(id, chamaId);
    if (!expense) {
      throw new Error('Expense not found');
    }

    // If changing category, verify new one exists and is valid for chama
    if (data.categoryId) {
      const category = await this.prisma.expense_category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category || (category.chama_id && category.chama_id !== chamaId)) {
        throw new BadRequestException('Category does not belong to this chama');
      }
    }

    const updateData: Prisma.expenseUpdateInput = {};
    if (data.description) updateData.description = data.description;
    if (data.amount) updateData.amount = parseFloat(data.amount);
    if (data.categoryId)
      updateData.category = { connect: { id: data.categoryId } };
    if (data.paidTo) updateData.paidTo = data.paidTo;
    if (data.paymentMethod)
      updateData.paymentMethod = data.paymentMethod as PaymentMethod;
    if (data.referenceNumber !== undefined)
      updateData.referenceNumber = data.referenceNumber;
    if (data.expenseDate) updateData.expenseDate = new Date(data.expenseDate);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.attachmentUrl !== undefined)
      updateData.attachmentUrl = data.attachmentUrl;

    return this.prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  /**
   * Delete an expense
   */
  async delete(id: string, chamaId: string): Promise<ExpenseWithCategory> {
    const expense = await this.findById(id, chamaId);
    if (!expense) {
      throw new Error('Expense not found');
    }

    return this.prisma.expense.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  /**
   * Get all categories for a chama
   * Includes global categories (chama_id is null)
   * Deduplicates by name, preferring chama-specific categories
   */
  async findCategories(chamaId: string): Promise<expense_category[]> {
    // Get only global categories (chama_id is null)
    // These are the ones actually used by expenses
    const allCategories = await this.prisma.expense_category.findMany({
      where: {
        chama_id: null, // Only global categories
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Deduplicate by name (keep first occurrence)
    const categoryMap = new Map<string, expense_category>();
    allCategories.forEach(cat => {
      if (!categoryMap.has(cat.name)) {
        categoryMap.set(cat.name, cat);
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  /**
   * Create or upsert default categories for a chama
   */
  async ensureDefaultCategories(chamaId: string): Promise<void> {
    const defaultCategories = [
      'Administrative',
      'Welfare',
      'Operations',
      'Reimbursements',
      'Events',
      'Miscellaneous',
    ];

    for (const name of defaultCategories) {
      await this.prisma.expense_category.upsert({
        where: {
          chama_id_name: {
            chama_id: chamaId,
            name,
          },
        },
        create: {
          id: uuid(),
          name,
          chama_id: chamaId,
        },
        update: {},
      });
    }
  }

  /**
   * Get expense statistics for a chama
   */
  async getStats(chamaId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const where: Prisma.expenseWhereInput = {
      chamaId,
      status: ExpenseStatus.APPROVED,
    };

    // Use Prisma aggregate for total approved expenses
    const totalResult = await this.prisma.expense.aggregate({
      where,
      _sum: { amount: true },
    });

    const totalExpenses = totalResult._sum?.amount
      ? parseFloat(totalResult._sum.amount.toString())
      : 0;

    // Use Prisma aggregate for this month expenses
    const monthResult = await this.prisma.expense.aggregate({
      where: {
        ...where,
        expenseDate: {
          gte: monthStart,
        },
      },
      _sum: { amount: true },
    });

    const thisMonthExpenses = monthResult._sum?.amount
      ? parseFloat(monthResult._sum.amount.toString())
      : 0;

    // Get largest approved expense
    const largestExpenseRecord = await this.prisma.expense.findFirst({
      where,
      orderBy: {
        amount: 'desc',
      },
      select: { amount: true },
    });

    const largestExpense = largestExpenseRecord
      ? parseFloat(largestExpenseRecord.amount.toString())
      : 0;

    // Get top category for approved expenses using raw query for grouping
    const topCategoryResult = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 1,
    });

    let topCategory = 'N/A';
    if (topCategoryResult.length > 0) {
      const topCategoryId = topCategoryResult[0].categoryId;
      const category = await this.prisma.expense_category.findUnique({
        where: { id: topCategoryId },
      });
      topCategory = category?.name || 'N/A';
    }

    return {
      totalExpenses,
      thisMonthExpenses,
      largestExpense,
      topCategory,
    };
  }

  /**
   * Approve an expense
   */
  async approve(
    id: string,
    chamaId: string,
    approvedById: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ExpenseWithCategory> {
    const client = tx ?? this.prisma;
    return client.expense.update({
      where: { id, status: 'PENDING' },
      data: {
        status: 'APPROVED',
        approvedBy: approvedById,
        approvedAt: new Date(),
        // Clear rejection info when approving (especially on appeal)
        rejectedBy: null,
        rejectedAt: null,
      },
      include: {
        category: true,
        approver: {
          include: {
            member_roles: {
              include: {
                role: true,
              },
            },
          },
        },
        rejector: {
          include: {
            member_roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Reject an expense
   */
  async reject(
    id: string,
    chamaId: string,
    rejectedById: string,
  ): Promise<ExpenseWithCategory> {
    return this.prisma.expense.update({
      where: { id, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        rejectedBy: rejectedById,
        rejectedAt: new Date(),
      },
      include: {
        category: true,
        approver: {
          include: {
            member_roles: {
              include: {
                role: true,
              },
            },
          },
        },
        rejector: {
          include: {
            member_roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
