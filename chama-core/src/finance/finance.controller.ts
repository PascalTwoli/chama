import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import {
  CashflowResponseDto,
  ExpenseBreakdownDto,
  FinanceSummaryDto,
} from './dto/financial-summary.dto';
import { FinanceService } from './finance.service';

@ApiTags('Finance')
@Controller('finance')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get finance summary',
    description:
      'Returns a unified finance summary derived from the transactions table',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiOkResponse({
    description: 'Finance summary retrieved successfully',
    type: FinanceSummaryDto,
  })
  async getSummary(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<FinanceSummaryDto> {
    return this.financeService.getSummary(chamaId, currentUser.id);
  }

  @Get('cashflow')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get monthly cashflow',
    description:
      'Returns monthly income, expenses, loans out, and repayments derived from transactions',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiQuery({ name: 'months', required: false, type: Number })
  @ApiOkResponse({
    description: 'Cashflow data retrieved successfully',
    type: CashflowResponseDto,
  })
  async getCashflow(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
    @Query('months') months?: string,
  ): Promise<CashflowResponseDto> {
    const parsedMonths = months ? Number(months) : 12;
    const data = await this.financeService.getCashflow(
      chamaId,
      currentUser.id,
      Number.isFinite(parsedMonths) ? parsedMonths : 12,
    );

    return { data };
  }

  @Get('expenses-breakdown')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get expense breakdown',
    description:
      'Returns expense totals grouped by category from the transactions ledger',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiOkResponse({
    description: 'Expense breakdown retrieved successfully',
    type: ExpenseBreakdownDto,
  })
  async getExpensesBreakdown(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<ExpenseBreakdownDto> {
    return this.financeService.getExpenseBreakdown(chamaId, currentUser.id);
  }
}
