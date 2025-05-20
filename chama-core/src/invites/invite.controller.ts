import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InviteService } from './invite.service';
import { CreateInviteDto, AcceptInviteDto } from './dto/create-invite.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';

@ApiTags('Invites')
@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new invite to join a chama' })
  @ApiResponse({ status: 201, description: 'Invite created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chama not found' })
  @ApiResponse({ status: 409, description: 'User already a member or has pending invite' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvite(
    @Body() createInviteDto: CreateInviteDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.inviteService.createInvite(createInviteDto, currentUser.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create invite: ${error.message}`,
      );
    }
  }

  @Get('chama/:chamaId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all pending invites for a chama' })
  @ApiResponse({ status: 200, description: 'List of pending invites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chama not found' })
  async listPendingInvites(
    @Param('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.inviteService.listPendingInvites(chamaId, currentUser.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to list pending invites: ${error.message}`,
      );
    }
  }

  @Post('accept')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept an invite to join a chama' })
  @ApiResponse({ status: 200, description: 'Invite accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired invite' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invite not found' })
  @ApiResponse({ status: 409, description: 'Already a member of this chama' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async acceptInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.inviteService.validateAndAcceptInvite(
        acceptInviteDto.token,
        currentUser.id,
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to accept invite: ${error.message}`,
      );
    }
  }

  @Get('pending')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending invites for the current user' })
  @ApiResponse({ status: 200, description: 'List of pending invites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getPendingInvitesForUser(
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      if (!currentUser.email) {
        throw new BadRequestException('User does not have an email address');
      }
      
      return await this.inviteService.getPendingInvitesForUser(currentUser.email);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to get pending invites: ${error.message}`,
      );
    }
  }
}

