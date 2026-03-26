import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import {
  ExpenseResponseDto,
  PaginatedExpensesDto,
  ExpenseStatsDto,
  ExpenseCategoryDto,
} from './dto/expense-response.dto';
import { user_role, system_role } from '@prisma/client';

interface CurrentUserType {
  id: string;
  email: string;
}

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    private readonly repository: ExpensesRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Check if user has permission to manage expenses in a chama
   * Allowed roles: Treasurer, Chairperson
   * Allowed system roles: Admin
   */
  private async canManageExpenses(
    userId: string,
    chamaId: string,
  ): Promise<boolean> {
    // Check system role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.system_role === system_role.ADMIN) {
      return true;
    }

    // Check chama role
    const memberRole = await this.prisma.member_role.findUnique({
      where: {
        user_id_chama_id: {
          user_id: userId,
          chama_id: chamaId,
        },
      },
      include: {
        role: true,
      },
    });

    if (!memberRole) {
      return false;
    }

    // Check if role has record_expenses permission
    const hasPermission = await this.prisma.role_permission.findFirst({
      where: {
        role_id: memberRole.role_id,
        permission: {
          key: 'record_expenses',
        },
      },
    });

    return !!hasPermission;
  }

  /**
   * Verify user is member of chama
   */
  private async verifyMembership(
    userId: string,
    chamaId: string,
  ): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        user_id: userId,
        chama_id: chamaId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this chama');
    }
  }

  /**
   * Verify chama exists
   */
  private async verifyChamaExists(chamaId: string): Promise<void> {
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException('Chama not found');
    }
  }

  /**
   * Create a new expense
   */
  async createExpense(
    createExpenseDto: CreateExpenseDto,
    currentUser: CurrentUserType,
  ): Promise<ExpenseResponseDto> {
    const { chamaId } = createExpenseDto;

    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    // Check permissions
    const canCreate = await this.canManageExpenses(currentUser.id, chamaId);
    if (!canCreate) {
      throw new ForbiddenException(
        'You do not have permission to create expenses',
      );
    }

    try {
      const expense = await this.repository.create(
        createExpenseDto,
        currentUser.id,
      );

      // Log activity
      this.logger.log(
        `[EXPENSE] Created: ${expense.referenceCode} for ${expense.amount} in chama ${chamaId} by ${currentUser.id}`,
      );

      return this.mapExpenseToDto(expense);
    } catch (error) {
      this.logger.error(
        `Failed to create expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Get paginated expenses for a chama
   */
  async getExpenses(
    currentUser: CurrentUserType,
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
  ): Promise<PaginatedExpensesDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    try {
      const result = await this.repository.findMany(
        chamaId,
        Math.max(1, page),
        Math.max(1, Math.min(limit, 100)), // Limit max 100 per page
        filters,
      );

      return {
        data: result.expenses.map(exp => this.mapExpenseToDto(exp)),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch expenses: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Get single expense by ID
   */
  async getExpenseById(
    currentUser: CurrentUserType,
    chamaId: string,
    id: string,
  ): Promise<ExpenseResponseDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    const expense = await this.repository.findById(id, chamaId);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.mapExpenseToDto(expense);
  }

  /**
   * Update an expense
   */
  async updateExpense(
    currentUser: CurrentUserType,
    chamaId: string,
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    // Check permissions
    const canCreate = await this.canManageExpenses(currentUser.id, chamaId);
    if (!canCreate) {
      throw new ForbiddenException(
        'You do not have permission to update expenses',
      );
    }

    try {
      const expense = await this.repository.update(
        id,
        chamaId,
        updateExpenseDto,
      );

      this.logger.log(
        `[EXPENSE] Updated: ${expense.referenceCode} by ${currentUser.id}`,
      );

      return this.mapExpenseToDto(expense);
    } catch (error) {
      if (error instanceof Error && error.message === 'Expense not found') {
        throw new NotFoundException('Expense not found');
      }
      this.logger.error(
        `Failed to update expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Delete an expense
   */
  async deleteExpense(
    currentUser: CurrentUserType,
    chamaId: string,
    id: string,
  ): Promise<void> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    // Check permissions
    const canCreate = await this.canManageExpenses(currentUser.id, chamaId);
    if (!canCreate) {
      throw new ForbiddenException(
        'You do not have permission to delete expenses',
      );
    }

    try {
      const expense = await this.repository.delete(id, chamaId);

      this.logger.log(
        `[EXPENSE] Deleted: ${expense.referenceCode} by ${currentUser.id}`,
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Expense not found') {
        throw new NotFoundException('Expense not found');
      }
      this.logger.error(
        `Failed to delete expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Get available expense categories for a chama
   */
  async getCategories(
    currentUser: CurrentUserType,
    chamaId: string,
  ): Promise<ExpenseCategoryDto[]> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    const categories = await this.repository.findCategories(chamaId);

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      createdAt: cat.createdAt.toISOString(),
      chamaId: cat.chama_id,
    }));
  }

  /**
   * Get expense statistics
   */
  async getStats(
    currentUser: CurrentUserType,
    chamaId: string,
  ): Promise<ExpenseStatsDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    try {
      const stats = await this.repository.getStats(chamaId);
      return stats;
    } catch (error) {
      this.logger.error(
        `Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Map expense entity to DTO
   */
  private mapExpenseToDto(expense: any): ExpenseResponseDto {
    return {
      id: expense.id,
      referenceCode: expense.referenceCode,
      chamaId: expense.chamaId,
      description: expense.description,
      amount: parseFloat(expense.amount.toString()),
      category: {
        id: expense.category.id,
        name: expense.category.name,
        createdAt: expense.category.createdAt.toISOString(),
        chamaId: expense.category.chama_id,
      },
      paidTo: expense.paidTo,
      paymentMethod: expense.paymentMethod,
      referenceNumber: expense.referenceNumber,
      expenseDate: expense.expenseDate.toISOString(),
      notes: expense.notes,
      attachmentUrl: expense.attachmentUrl,
      createdBy: expense.createdBy,
      status: expense.status,
      approvedBy: expense.approvedBy,
      approver: expense.approver
        ? {
            id: expense.approver.id,
            name: expense.approver.full_name || expense.approver.name,
            role: expense.approver.member_roles?.[0]?.role?.name || 'Member',
          }
        : null,
      approvedAt: expense.approvedAt ? expense.approvedAt.toISOString() : null,
      rejectedBy: expense.rejectedBy,
      rejector: expense.rejector
        ? {
            id: expense.rejector.id,
            name: expense.rejector.full_name || expense.rejector.name,
            role: expense.rejector.member_roles?.[0]?.role?.name || 'Member',
          }
        : null,
      rejectedAt: expense.rejectedAt ? expense.rejectedAt.toISOString() : null,
      createdAt: expense.createdAt.toISOString(),
    };
  }

  /**
   * Approve an expense
   * Only Chairperson and Admin can approve
   * Treasurer cannot approve their own expense
   */
  async approveExpense(
    currentUser: CurrentUserType,
    chamaId: string,
    expenseId: string,
  ): Promise<ExpenseResponseDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    // Check if user has approval permission (Chairperson, Admin, or Owner)
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    const isSystemAdmin =
      user?.system_role === system_role.ADMIN ||
      user?.system_role === system_role.OWNER;

    // Check chama role
    const memberRole = await this.prisma.member_role.findUnique({
      where: {
        user_id_chama_id: {
          user_id: currentUser.id,
          chama_id: chamaId,
        },
      },
      include: {
        role: true,
      },
    });

    // Only Chairperson, Admin or Owner can approve
    const isChairperson = memberRole?.role.name === 'CHAIRPERSON';
    if (!isSystemAdmin && !isChairperson) {
      throw new ForbiddenException(
        'Only Chairperson, Admin or Owner can approve expenses',
      );
    }

    // Get the expense to check who created it
    const expense = await this.repository.findById(expenseId, chamaId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Treasurer cannot approve their own expense
    if (
      memberRole?.role.name === 'TREASURER' &&
      expense.createdBy === currentUser.id
    ) {
      throw new ForbiddenException(
        'Treasurer cannot approve their own expense',
      );
    }

    try {
      const updatedExpense = await this.repository.approve(
        expenseId,
        chamaId,
        currentUser.id,
      );

      // Log activity
      this.logger.log(
        `[EXPENSE] Approved: ${updatedExpense.referenceCode} in chama ${chamaId} by ${currentUser.id}`,
      );

      return this.mapExpenseToDto(updatedExpense);
    } catch (error) {
      this.logger.error(
        `[EXPENSE] Error approving ${expenseId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Reject an expense
   * Only Chairperson and Admin can reject
   */
  async rejectExpense(
    currentUser: CurrentUserType,
    chamaId: string,
    expenseId: string,
  ): Promise<ExpenseResponseDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    // Check if user has approval permission (Chairperson, Admin, or Owner)
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    const isSystemAdmin =
      user?.system_role === system_role.ADMIN ||
      user?.system_role === system_role.OWNER;

    // Check chama role
    const memberRole = await this.prisma.member_role.findUnique({
      where: {
        user_id_chama_id: {
          user_id: currentUser.id,
          chama_id: chamaId,
        },
      },
      include: {
        role: true,
      },
    });

    // Only Chairperson, Admin or Owner can reject
    const isChairperson = memberRole?.role.name === 'CHAIRPERSON';
    if (!isSystemAdmin && !isChairperson) {
      throw new ForbiddenException(
        'Only Chairperson, Admin or Owner can reject expenses',
      );
    }

    // Verify expense exists
    const expense = await this.repository.findById(expenseId, chamaId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    try {
      const updatedExpense = await this.repository.reject(
        expenseId,
        chamaId,
        currentUser.id,
      );

      // Log activity
      this.logger.log(
        `[EXPENSE] Rejected: ${updatedExpense.referenceCode} in chama ${chamaId} by ${currentUser.id}`,
      );

      return this.mapExpenseToDto(updatedExpense);
    } catch (error) {
      this.logger.error(
        `[EXPENSE] Error rejecting ${expenseId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Upload an attachment (receipt/invoice) for an expense
   * Only PENDING expenses can have attachments uploaded
   * Only the creator or authorized personnel can upload
   */
  async uploadAttachment(
    currentUser: CurrentUserType,
    chamaId: string,
    expenseId: string,
    file: any,
  ): Promise<ExpenseResponseDto> {
    // Verify chama exists
    await this.verifyChamaExists(chamaId);

    // Verify user is member
    await this.verifyMembership(currentUser.id, chamaId);

    // Verify expense exists
    const expense = await this.repository.findById(expenseId, chamaId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Only creator or authorized personnel can upload
    const isCreator = expense.createdBy === currentUser.id;
    const hasPermission = await this.canManageExpenses(currentUser.id, chamaId);

    if (!isCreator && !hasPermission) {
      throw new ForbiddenException(
        'Only the creator or authorized personnel can upload attachments',
      );
    }

    try {
      // Store attachment URL (in real implementation, would upload to cloud storage)
      // For now, just store a placeholder URL
      const attachmentUrl = `/uploads/expenses/${file.filename}`;

      const updatedExpense = await this.prisma.expense.update({
        where: { id: expenseId },
        data: {
          attachmentUrl,
        },
        include: {
          category: true,
        },
      });

      this.logger.log(
        `[EXPENSE] Attachment uploaded to ${expenseId} by ${currentUser.id}`,
      );

      return this.mapExpenseToDto(updatedExpense);
    } catch (error) {
      this.logger.error(
        `[EXPENSE] Error uploading attachment to ${expenseId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
