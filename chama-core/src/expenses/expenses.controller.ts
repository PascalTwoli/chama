import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { FileUploadService } from './file-upload.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApproveExpenseDto, RejectExpenseDto } from './dto/approve-expense.dto';
import {
  ExpenseResponseDto,
  PaginatedExpensesDto,
  ExpenseStatsDto,
  ExpenseCategoryDto,
  GetExpensesQueryDto,
} from './dto/expense-response.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

type CurrentUserType = {
  id: string;
  email: string;
};

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new expense',
    description: 'Create a new expense. Requires record_expenses permission.',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiCreatedResponse({
    description: 'Expense created successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or category not found',
  })
  @ApiResponse({
    status: 403,
    description: 'User lacks permission to create expenses',
  })
  @ApiResponse({
    status: 404,
    description: 'Chama not found',
  })
  async createExpense(
    @Query('chamaId') chamaId: string,
    @Body(ValidationPipe) createExpenseDto: CreateExpenseDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ExpenseResponseDto> {
    // Validate chamaId is provided
    if (!chamaId || chamaId.trim() === '') {
      throw new BadRequestException('chamaId query parameter is required');
    }

    // Simple UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(chamaId)) {
      throw new BadRequestException('chamaId must be a valid UUID');
    }

    console.log('[EXPENSE_CREATE] Request received');
    console.log('[EXPENSE_CREATE] Query chamaId:', chamaId);
    console.log('[EXPENSE_CREATE] DTO body:', createExpenseDto);

    // Validate amount is within acceptable range
    const amount = parseFloat(createExpenseDto.amount);
    if (isNaN(amount) || amount <= 0.01 || amount > 999999.99) {
      throw new BadRequestException(
        'Amount must be between 0.01 and 999999.99',
      );
    }

    // Merge chamaId from query parameter into the DTO
    const expenseData: CreateExpenseDto = { ...createExpenseDto, chamaId };
    console.log('[EXPENSE_CREATE] Final DTO with chamaId:', expenseData);
    return this.expensesService.createExpense(expenseData, currentUser);
  }

  // SPECIFIC GET ROUTES MUST COME FIRST (before generic @Get())
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get expense statistics',
    description:
      'Retrieve expense statistics including totals, monthly expenses, and top categories',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: ExpenseStatsDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User is not a member of this chama',
  })
  @ApiResponse({
    status: 404,
    description: 'Chama not found',
  })
  async getStats(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<ExpenseStatsDto> {
    return this.expensesService.getStats(currentUser, chamaId);
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get available expense categories',
    description:
      'Retrieve all expense categories available for the chama (including global defaults)',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [ExpenseCategoryDto],
  })
  @ApiResponse({
    status: 403,
    description: 'User is not a member of this chama',
  })
  @ApiResponse({
    status: 404,
    description: 'Chama not found',
  })
  async getCategories(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<ExpenseCategoryDto[]> {
    return this.expensesService.getCategories(currentUser, chamaId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get single expense by ID',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Expense retrieved successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User is not a member of this chama',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense or chama not found',
  })
  async getExpenseById(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id') id: string,
    @Query('chamaId') chamaId: string,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.getExpenseById(currentUser, chamaId, id);
  }

  // GENERIC GET ROUTE COMES LAST
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated expenses for a chama',
    description: 'Retrieve paginated list of expenses with optional filters',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({
    name: 'paymentMethod',
    required: false,
    enum: ['MPESA', 'BANK_TRANSFER', 'CASH', 'OTHER'],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  })
  @ApiResponse({
    status: 200,
    description: 'Expenses retrieved successfully',
    type: PaginatedExpensesDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User is not a member of this chama',
  })
  @ApiResponse({
    status: 404,
    description: 'Chama not found',
  })
  async getExpenses(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('categoryId') categoryId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedExpensesDto> {
    return this.expensesService.getExpenses(
      currentUser,
      chamaId,
      Math.max(1, parseInt(page, 10) || 1),
      Math.max(1, parseInt(limit, 10) || 20),
      {
        categoryId,
        dateFrom,
        dateTo,
        paymentMethod,
        status,
      },
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an expense',
    description:
      'Update an existing expense. Requires record_expenses permission.',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 403,
    description: 'User lacks permission or is not a chama member',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense or chama not found',
  })
  async updateExpense(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id') id: string,
    @Query('chamaId') chamaId: string,
    @Body(ValidationPipe) updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.updateExpense(
      currentUser,
      chamaId,
      id,
      updateExpenseDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an expense',
    description:
      'Delete an existing expense. Requires record_expenses permission.',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 204,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'User lacks permission or is not a chama member',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense or chama not found',
  })
  async deleteExpense(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id') id: string,
    @Query('chamaId') chamaId: string,
  ): Promise<void> {
    await this.expensesService.deleteExpense(currentUser, chamaId, id);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve an expense',
    description:
      'Approve an existing expense. Only Chairperson and Admin can approve. Treasurer cannot approve their own expense.',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Expense approved successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 403,
    description: 'User lacks permission or is not a chama member',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense or chama not found',
  })
  async approveExpense(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id') id: string,
    @Query('chamaId') chamaId: string,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.approveExpense(currentUser, chamaId, id);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reject an expense',
    description:
      'Reject an existing expense. Only Chairperson and Admin can reject.',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Expense rejected successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 403,
    description: 'User lacks permission or is not a chama member',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense or chama not found',
  })
  async rejectExpense(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id') id: string,
    @Query('chamaId') chamaId: string,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.rejectExpense(currentUser, chamaId, id);
  }

  @Post(':id/attachment')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('attachment', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({
    summary: 'Upload an attachment for an expense',
    description:
      'Upload a receipt or invoice file for an expense. Requires record_expenses permission. Allowed formats: JPEG, PNG, PDF. Max size: 5MB.',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Attachment uploaded successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type, file too large, or expense not found',
  })
  @ApiResponse({
    status: 403,
    description: 'User lacks permission or is not a chama member',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense or chama not found',
  })
  async uploadAttachment(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id') expenseId: string,
    @Query('chamaId') chamaId: string,
    @UploadedFile() file?: any,
  ): Promise<ExpenseResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.expensesService.uploadAttachment(
      currentUser,
      chamaId,
      expenseId,
      file,
    );
  }
}
