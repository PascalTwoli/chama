import {
  Controller,
  Get,
  Put,
  Param,
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
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import {
  NotificationResponseDto,
  NotificationStatsDto,
  PaginatedNotificationsDto,
} from './dto/notification-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { NotificationAudience } from '@prisma/client';

// Define a simple type for the current user
type CurrentUserType = {
  id: string;
  email: string;
};

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications for current user in a chama' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: PaginatedNotificationsDto,
  })
  async getNotifications(
    @CurrentUser() currentUser: CurrentUserType,
    @Query() query: GetNotificationsDto,
  ): Promise<PaginatedNotificationsDto> {
    return this.notificationsService.getNotifications(
      currentUser.id,
      query.chamaId,
      query,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiQuery({ name: 'chamaId', required: true, description: 'Chama ID' })
  @ApiQuery({
    name: 'audience',
    required: false,
    enum: ['ADMIN', 'MEMBER'],
    description: 'Filter by audience',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: NotificationStatsDto,
  })
  async getStats(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('chamaId') chamaId: string,
    @Query('audience') audience?: NotificationAudience,
  ): Promise<NotificationStatsDto> {
    return this.notificationsService.getStats(
      currentUser.id,
      chamaId,
      audience,
    );
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiQuery({ name: 'chamaId', required: true, description: 'Chama ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(
    @Param('id') id: string,
    @Query('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markAsRead(id, currentUser.id, chamaId);
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiQuery({ name: 'chamaId', required: true, description: 'Chama ID' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of notifications marked as read',
        },
      },
    },
  })
  async markAllAsRead(
    @Query('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<{ count: number }> {
    return this.notificationsService.markAllAsRead(currentUser.id, chamaId);
  }
}
