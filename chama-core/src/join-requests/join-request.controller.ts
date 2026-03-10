import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
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
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { ReviewJoinRequestDto } from './dto/review-join-request.dto';
import { JoinRequestResponseDto } from './dto/join-request-response.dto';

@ApiTags('Join Requests')
@Controller('chamas')
export class JoinRequestController {
  constructor(private readonly joinRequestService: JoinRequestService) {}

  /**
   * Submit a join request for a chama
   */
  @Post(':chamaId/requests')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a join request for a chama' })
  @ApiResponse({
    status: 201,
    description: 'Join request created successfully',
    type: JoinRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chama not found' })
  @ApiResponse({
    status: 409,
    description: 'User already a member or has pending request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createJoinRequest(
    @Param('chamaId') chamaId: string,
    @Body() createDto: CreateJoinRequestDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<JoinRequestResponseDto> {
    try {
      const joinRequest = await this.joinRequestService.createJoinRequest(
        user.id,
        { ...createDto, chamaId },
      );
      return this.mapToResponseDto(joinRequest);
    } catch (error) {
      this.handleError(error, 'Failed to create join request');
    }
  }

  /**
   * List pending join requests for a chama (chairperson only)
   */
  @Get(':chamaId/requests')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending join requests for a chama' })
  @ApiResponse({
    status: 200,
    description: 'List of pending join requests',
    type: [JoinRequestResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a chairperson' })
  @ApiResponse({ status: 404, description: 'Chama not found' })
  async getPendingRequests(
    @Param('chamaId') chamaId: string,
    @CurrentUser() user: CurrentUserType,
  ): Promise<JoinRequestResponseDto[]> {
    try {
      const requests = await this.joinRequestService.getPendingRequestsForChama(
        chamaId,
        user.id,
      );
      return requests.map(req => this.mapToResponseDto(req));
    } catch (error) {
      this.handleError(error, 'Failed to get pending requests');
    }
  }

  /**
   * Approve or reject a join request (chairperson only)
   */
  @Post(':chamaId/requests/:requestId/review')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve or reject a join request' })
  @ApiResponse({
    status: 200,
    description: 'Join request reviewed successfully',
    type: JoinRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a chairperson' })
  @ApiResponse({ status: 404, description: 'Join request not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async reviewJoinRequest(
    @Param('chamaId') chamaId: string,
    @Param('requestId') requestId: string,
    @Body() reviewDto: ReviewJoinRequestDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<JoinRequestResponseDto> {
    try {
      if (reviewDto.action === 'approve') {
        const result = await this.joinRequestService.approveJoinRequest(
          requestId,
          user.id,
          chamaId,
        );
        return this.mapToResponseDto(result.joinRequest);
      } else {
        const joinRequest = await this.joinRequestService.rejectJoinRequest(
          requestId,
          user.id,
          chamaId,
        );
        return this.mapToResponseDto(joinRequest);
      }
    } catch (error) {
      this.handleError(error, 'Failed to review join request');
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
            phoneNumber: joinRequest.user_join_request_user_idTouser.phone,
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
