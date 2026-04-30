import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { TreasuryService } from './treasury.service';
import { TreasurySummaryDto } from './dto/treasury-summary.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

interface CurrentUserType {
  id: string;
  email: string;
}

@ApiTags('Treasury')
@ApiBearerAuth()
@Controller('treasury')
@UseGuards(AuthGuard)
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get treasury summary',
    description:
      'Get a summary of the chama treasury balance, including contributions, expenses, and loan flows. Treasury Balance = Contributions - Expenses - Loans Disbursed + Loan Repayments',
  })
  @ApiQuery({
    name: 'chamaId',
    required: true,
    type: String,
    description: 'The ID of the chama',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Treasury summary retrieved successfully',
    type: TreasurySummaryDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not a member of the chama',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chama not found',
  })
  async getTreasurySummary(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
  ): Promise<TreasurySummaryDto> {
    return this.treasuryService.getTreasurySummary(currentUser, chamaId);
  }
}
