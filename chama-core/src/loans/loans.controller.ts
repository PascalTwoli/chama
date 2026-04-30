import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { LoansService } from './loans.service';
import { RequestLoanDto } from './dto/request-loan.dto';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApproveLoanDto, RejectLoanDto } from './dto/approve-loan.dto';
import { DisburseLoanDto } from './dto/disburse-loan.dto';
import { RecordRepaymentDto } from './dto/repayment.dto';
import { LoanQueryDto } from './dto/loan-query.dto';
import {
  LoanResponseDto,
  PaginatedLoansDto,
  LoanStatsDto,
} from './dto/loan-response.dto';

@ApiTags('Loans')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // ─── STATS ────────────────────────────────────────────────────────────────

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get loan statistics for a chama' })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Loan stats', type: LoanStatsDto })
  @ApiResponse({ status: 403, description: 'Not a member of this chama' })
  async getStats(
    @Query('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanStatsDto> {
    return this.loansService.getStats(chamaId, currentUser.id);
  }

  // ─── LIST ─────────────────────────────────────────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List loans with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated loan list', type: PaginatedLoansDto })
  async findMany(
    @Query() query: LoanQueryDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<PaginatedLoansDto> {
    return this.loansService.findMany(query, currentUser.id);
  }

  // ─── DETAIL ───────────────────────────────────────────────────────────────

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get loan details with repayment history' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan details', type: LoanResponseDto })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.findById(id, currentUser.id);
  }

  // ─── MEMBER REQUEST ───────────────────────────────────────────────────────

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Member requests a loan' })
  @ApiResponse({ status: 201, description: 'Loan request created', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Active or defaulted loan exists' })
  @ApiResponse({ status: 403, description: 'Not a chama member' })
  async requestLoan(
    @Body() dto: RequestLoanDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.requestLoan(dto, currentUser.id);
  }

  // ─── ADMIN DIRECT CREATION ────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin direct loan creation (APPROVED or DISBURSED)' })
  @ApiResponse({ status: 201, description: 'Loan created', type: LoanResponseDto })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async createLoan(
    @Body() dto: CreateLoanDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.createLoan(dto, currentUser.id);
  }

  // ─── REVIEW ───────────────────────────────────────────────────────────────

  @Patch(':id/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Move loan from REQUESTED to UNDER_REVIEW' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan moved to review', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Loan not in REQUESTED status' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async reviewLoan(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.reviewLoan(id, currentUser.id);
  }

  // ─── APPROVE ──────────────────────────────────────────────────────────────

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a loan (sets amounts, interest, and due date)' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan approved', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Loan not in approvable status' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async approveLoan(
    @Param('id') id: string,
    @Body() dto: ApproveLoanDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.approveLoan(id, dto, currentUser.id);
  }

  // ─── REJECT ───────────────────────────────────────────────────────────────

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a loan request' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan rejected', type: LoanResponseDto })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async rejectLoan(
    @Param('id') id: string,
    @Body() dto: RejectLoanDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.rejectLoan(id, dto, currentUser.id);
  }

  // ─── DISBURSE ─────────────────────────────────────────────────────────────

  @Patch(':id/disburse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disburse an approved loan (sets start date, due date, records treasury transaction)' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan disbursed', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Loan not APPROVED or already disbursed' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async disburseLoan(
    @Param('id') id: string,
    @Body() dto: DisburseLoanDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.disburseLoan(id, dto, currentUser.id);
  }

  // ─── REPAYMENT ────────────────────────────────────────────────────────────

  @Post(':id/repayments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a loan repayment' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 201, description: 'Repayment recorded', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid loan status or zero balance' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async recordRepayment(
    @Param('id') id: string,
    @Body() dto: RecordRepaymentDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.recordRepayment(id, dto, currentUser.id);
  }

  // ─── DEFAULT ──────────────────────────────────────────────────────────────

  @Patch(':id/default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a loan as defaulted' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({ status: 200, description: 'Loan marked as defaulted', type: LoanResponseDto })
  @ApiResponse({ status: 400, description: 'Loan not ACTIVE or OVERDUE' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async markDefaulted(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<LoanResponseDto> {
    return this.loansService.markDefaulted(id, currentUser.id);
  }
}
