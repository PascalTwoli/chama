import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { JoinRequestService } from './join-request.service';
import { JoinRequestResponseDto } from './dto/join-request-response.dto';

@ApiTags('Join Requests')
@Controller('users')
export class UserJoinRequestController {
  constructor(private readonly joinRequestService: JoinRequestService) {}

  /**
   * Get current user's join requests
   */
  @Get('me/join-requests')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's join requests" })
  @ApiResponse({
    status: 200,
    description: "List of user's join requests",
    type: [JoinRequestResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyJoinRequests(
    @CurrentUser() user: CurrentUserType,
  ): Promise<JoinRequestResponseDto[]> {
    try {
      const requests = await this.joinRequestService.getUserJoinRequests(
        user.id,
      );
      return requests.map(req => this.mapToResponseDto(req));
    } catch (error) {
      this.handleError(error, 'Failed to get join requests');
    }
  }

  /**
   * Map join_request entity to response DTO
   */
  private mapToResponseDto(joinRequest: any): JoinRequestResponseDto {
    return {
      id: joinRequest.id,
      chamaId: joinRequest.chama_id,
      userId: joinRequest.user_id,
      status: joinRequest.status,
      message: joinRequest.message,
      createdAt: joinRequest.createdAt,
      updatedAt: joinRequest.updatedAt,
      reviewedBy: joinRequest.reviewed_by,
      reviewedAt: joinRequest.reviewed_at,
      user: joinRequest.user_join_request_user_idTouser
        ? {
            id: joinRequest.user_join_request_user_idTouser.id,
            name: joinRequest.user_join_request_user_idTouser.name,
            email: joinRequest.user_join_request_user_idTouser.email,
            phoneNumber: joinRequest.user_join_request_user_idTouser.phone || null,
          }
        : undefined,
      chama: joinRequest.chama
        ? {
            id: joinRequest.chama.id,
            name: joinRequest.chama.name,
            description: joinRequest.chama.description,
          }
        : undefined,
    };
  }

  /**
   * Common error handler for controller methods
   */
  private handleError(error: any, defaultMessage: string): never {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException(
      `${defaultMessage}: ${error.message || 'Unknown error'}`,
    );
  }
}
