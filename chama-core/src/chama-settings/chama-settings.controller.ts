import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
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
import { ChamaSettingsService, ChamaSettingsResponse } from './chama-settings.service';
import { CreateChamaSettingsDto } from './dto/create-chama-settings.dto';
import { UpdateChamaSettingsDto } from './dto/update-chama-settings.dto';
import { ContributionModel, ContributionFrequency } from '@prisma/client';

@ApiTags('Chama Settings')
@Controller('chamas/:chamaId/settings')
export class ChamaSettingsController {
  constructor(private readonly chamaSettingsService: ChamaSettingsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get chama settings',
    description: 'Returns the settings for a specific chama',
  })
  @ApiParam({ name: 'chamaId', description: 'ID of the chama', type: 'string' })
  @ApiOkResponse({
    description: 'Chama settings',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Settings ID' },
        chamaId: { type: 'string', description: 'Chama ID' },
        contributionModel: {
          type: 'string',
          enum: Object.values(ContributionModel),
          description: 'Contribution model type',
        },
        contributionAmount: { type: 'integer', nullable: true, description: 'Fixed contribution amount' },
        frequency: {
          type: 'string',
          enum: Object.values(ContributionFrequency),
          nullable: true,
          description: 'Contribution frequency',
        },
        dueDay: { type: 'integer', nullable: true, description: 'Due day' },
        gracePeriodDays: { type: 'integer', nullable: true, description: 'Grace period in days' },
        latePaymentFee: { type: 'integer', nullable: true, description: 'Late payment fee' },
        minimumContribution: { type: 'integer', nullable: true, description: 'Minimum contribution for flexible model' },
        contributionGuidelines: { type: 'string', nullable: true, description: 'Contribution guidelines' },
        requireMeetingAttendance: { type: 'boolean', description: 'Whether meeting attendance is required' },
        enableMemberLoans: { type: 'boolean', description: 'Whether member loans are enabled' },
        automaticSmsReminders: { type: 'boolean', description: 'Whether automatic SMS reminders are enabled' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not a member of this chama' })
  @ApiNotFoundResponse({ description: 'Chama or settings not found' })
  async getSettings(
    @Param('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ChamaSettingsResponse> {
    try {
      return await this.chamaSettingsService.findOne(chamaId, currentUser.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch chama settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create chama settings',
    description: 'Creates settings for a chama. Only chairpersons, treasurers, or secretaries can create settings.',
  })
  @ApiParam({ name: 'chamaId', description: 'ID of the chama', type: 'string' })
  @ApiBody({ type: CreateChamaSettingsDto })
  @ApiCreatedResponse({
    description: 'Chama settings created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Settings ID' },
        chamaId: { type: 'string', description: 'Chama ID' },
        contributionModel: {
          type: 'string',
          enum: Object.values(ContributionModel),
          description: 'Contribution model type',
        },
        contributionAmount: { type: 'integer', nullable: true, description: 'Fixed contribution amount' },
        frequency: {
          type: 'string',
          enum: Object.values(ContributionFrequency),
          nullable: true,
          description: 'Contribution frequency',
        },
        dueDay: { type: 'integer', nullable: true, description: 'Due day' },
        gracePeriodDays: { type: 'integer', nullable: true, description: 'Grace period in days' },
        latePaymentFee: { type: 'integer', nullable: true, description: 'Late payment fee' },
        minimumContribution: { type: 'integer', nullable: true, description: 'Minimum contribution for flexible model' },
        contributionGuidelines: { type: 'string', nullable: true, description: 'Contribution guidelines' },
        requireMeetingAttendance: { type: 'boolean', description: 'Whether meeting attendance is required' },
        enableMemberLoans: { type: 'boolean', description: 'Whether member loans are enabled' },
        automaticSmsReminders: { type: 'boolean', description: 'Whether automatic SMS reminders are enabled' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid settings data' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to create settings' })
  @ApiNotFoundResponse({ description: 'Chama not found' })
  @ApiConflictResponse({ description: 'Settings already exist for this chama' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createSettings(
    @Param('chamaId') chamaId: string,
    @Body() createDto: CreateChamaSettingsDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ChamaSettingsResponse> {
    try {
      return await this.chamaSettingsService.create(chamaId, createDto, currentUser.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof BadRequestException) throw error;
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        `Failed to create chama settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Put()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update chama settings',
    description: 'Updates settings for a chama. Only chairpersons, treasurers, or secretaries can update settings.',
  })
  @ApiParam({ name: 'chamaId', description: 'ID of the chama', type: 'string' })
  @ApiBody({ type: UpdateChamaSettingsDto })
  @ApiOkResponse({
    description: 'Chama settings updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Settings ID' },
        chamaId: { type: 'string', description: 'Chama ID' },
        contributionModel: {
          type: 'string',
          enum: Object.values(ContributionModel),
          description: 'Contribution model type',
        },
        contributionAmount: { type: 'integer', nullable: true, description: 'Fixed contribution amount' },
        frequency: {
          type: 'string',
          enum: Object.values(ContributionFrequency),
          nullable: true,
          description: 'Contribution frequency',
        },
        dueDay: { type: 'integer', nullable: true, description: 'Due day' },
        gracePeriodDays: { type: 'integer', nullable: true, description: 'Grace period in days' },
        latePaymentFee: { type: 'integer', nullable: true, description: 'Late payment fee' },
        minimumContribution: { type: 'integer', nullable: true, description: 'Minimum contribution for flexible model' },
        contributionGuidelines: { type: 'string', nullable: true, description: 'Contribution guidelines' },
        requireMeetingAttendance: { type: 'boolean', description: 'Whether meeting attendance is required' },
        enableMemberLoans: { type: 'boolean', description: 'Whether member loans are enabled' },
        automaticSmsReminders: { type: 'boolean', description: 'Whether automatic SMS reminders are enabled' },
        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid settings data' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to update settings' })
  @ApiNotFoundResponse({ description: 'Chama or settings not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateSettings(
    @Param('chamaId') chamaId: string,
    @Body() updateDto: UpdateChamaSettingsDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ChamaSettingsResponse> {
    try {
      return await this.chamaSettingsService.update(chamaId, updateDto, currentUser.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to update chama settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
