import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard, RequirePermission } from '../guards/permission.guard';
import { CurrentUser, type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { ContributionsService } from './contributions.service';
import { OpenPeriodDto } from './dto/open-period.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { ContributionQueryDto } from './dto/query.dto';
import {
  ContributionBoardRowDto,
  ContributionPeriodDto,
  ContributionStatsDto,
  PaginatedPaymentsDto,
  PaginatedPeriodsDto,
} from './dto/contribution-response.dto';

@ApiTags('Contributions')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly service: ContributionsService) {}

  // ─── Current Live Board ───────────────────────────────────────────────────────

  @Get('current')
  @RequirePermission('contribution.view')
  @ApiOperation({ summary: 'Live contribution board for the current open period' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiResponse({ status: 200, type: [ContributionBoardRowDto] })
  async getCurrent(
    @CurrentUser() user: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<ContributionBoardRowDto[]> {
    return this.service.getCurrentBoard(chamaId, user.id);
  }

  // ─── Stats ────────────────────────────────────────────────────────────────────

  @Get('stats')
  @RequirePermission('contribution.view')
  @ApiOperation({ summary: 'Contribution statistics for the current period' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiResponse({ status: 200, type: ContributionStatsDto })
  async getStats(
    @CurrentUser() user: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<ContributionStatsDto> {
    return this.service.getStats(chamaId, user.id);
  }

  // ─── CSV Export ───────────────────────────────────────────────────────────────

  @Get('export')
  @RequirePermission('contribution.export')
  @ApiOperation({ summary: 'Export contributions as CSV' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiQuery({ name: 'periodId', required: false })
  async exportCsv(
    @CurrentUser() user: CurrentUserType,
    @Query('chamaId') chamaId: string,
    @Query('periodId') periodId: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.service.exportCsv(chamaId, periodId, user.id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="contributions-${chamaId}.csv"`);
    res.send(csv);
  }

  // ─── History ──────────────────────────────────────────────────────────────────

  @Get('history')
  @RequirePermission('contribution.view')
  @ApiOperation({ summary: 'Paginated payment history with optional filters' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiQuery({ name: 'periodId', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: PaginatedPaymentsDto })
  async getHistory(
    @CurrentUser() user: CurrentUserType,
    @Query('chamaId') chamaId: string,
    @Query() query: ContributionQueryDto,
  ): Promise<PaginatedPaymentsDto> {
    return this.service.getHistory(chamaId, user.id, query);
  }

  // ─── Periods ──────────────────────────────────────────────────────────────────

  @Get('periods')
  @RequirePermission('contribution.view')
  @ApiOperation({ summary: 'List all contribution periods for a chama' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: PaginatedPeriodsDto })
  async getPeriods(
    @CurrentUser() user: CurrentUserType,
    @Query('chamaId') chamaId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ): Promise<PaginatedPeriodsDto> {
    return this.service.getPeriods(chamaId, user.id, parseInt(page, 10), parseInt(limit, 10));
  }

  @Post('periods/open')
  @RequirePermission('contribution.manage_periods')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Open a new contribution period' })
  @ApiResponse({ status: 201, type: ContributionPeriodDto })
  async openPeriod(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: OpenPeriodDto,
  ): Promise<ContributionPeriodDto> {
    return this.service.openPeriod(dto, user.id);
  }

  @Patch('periods/:id/close')
  @RequirePermission('contribution.manage_periods')
  @ApiOperation({ summary: 'Close a contribution period' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiResponse({ status: 200, type: ContributionPeriodDto })
  async closePeriod(
    @CurrentUser() user: CurrentUserType,
    @Param('id') periodId: string,
    @Query('chamaId') chamaId: string,
  ): Promise<ContributionPeriodDto> {
    return this.service.closePeriod(periodId, chamaId, user.id);
  }

  @Get('periods/:id')
  @RequirePermission('contribution.view')
  @ApiOperation({ summary: 'Get a single contribution period with full detail' })
  @ApiQuery({ name: 'chamaId', required: true })
  @ApiResponse({ status: 200, type: ContributionPeriodDto })
  async getPeriodById(
    @CurrentUser() user: CurrentUserType,
    @Param('id') periodId: string,
    @Query('chamaId') chamaId: string,
  ): Promise<ContributionPeriodDto> {
    return this.service.getPeriodById(periodId, chamaId, user.id);
  }

  // ─── Record Payment ───────────────────────────────────────────────────────────

  @Post('record')
  @RequirePermission('contribution.record')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a member contribution payment' })
  @ApiResponse({ status: 201, type: ContributionBoardRowDto })
  async recordPayment(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: RecordPaymentDto,
  ): Promise<ContributionBoardRowDto> {
    return this.service.recordPayment(dto, user.id);
  }
}
