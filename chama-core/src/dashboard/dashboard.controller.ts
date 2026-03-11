import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { DashboardService, DashboardResponse } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('chama/:chamaId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get dashboard data for a chama',
    description:
      'Returns all dashboard metrics for a specific chama in a single response',
  })
  @ApiParam({
    name: 'chamaId',
    description: 'ID of the chama',
    type: 'string',
  })
  @ApiOkResponse({ description: 'Dashboard data returned successfully' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User is not a member of this chama' })
  @ApiNotFoundResponse({ description: 'Chama not found' })
  async getDashboard(
    @Param('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<DashboardResponse> {
    try {
      return await this.dashboardService.getDashboard(
        chamaId,
        currentUser.id,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
