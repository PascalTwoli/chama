import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
  ClassSerializerInterceptor,
  UseInterceptors,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { AcceptInviteDto, CreateInviteDto } from './dto/create-invite.dto';
import { InviteService } from './invite.service';
import { InviteEntity } from './entities/invite.entity';
import { MembershipEntity } from './entities/membership.entity';

@ApiTags('Invites')
@Controller('invites')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
  excludePrefixes: ['_'],
})
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  /**
   * Creates a new invite to join a chama
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new invite to join a chama' })
  @ApiResponse({ 
    status: 201, 
    description: 'Invite created successfully',
    type: InviteEntity
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chama not found' })
  @ApiResponse({ status: 409, description: 'User already a member or has pending invite' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvite(
    @Body() createInviteDto: CreateInviteDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<InviteEntity> {
    try {
      const invite = await this.inviteService.createInvite(createInviteDto, currentUser.id);
      return new InviteEntity(invite.invite);
    } catch (error) {
      this.handleError(error, 'Failed to create invite');
    }
  }

  /**
   * Lists all pending invites for a specific chama
   */
  @Get('chama/:chamaId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all pending invites for a chama' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of pending invites',
    type: [InviteEntity]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Chama not found' })
  async listPendingInvites(
    @Param('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<InviteEntity[]> {
    try {
      const invites = await this.inviteService.listPendingInvites(chamaId, currentUser.id);
      return invites.map(invite => new InviteEntity(invite));
    } catch (error) {
      this.handleError(error, 'Failed to list pending invites');
    }
  }

  /**
   * Accepts an invitation to join a chama
   */
  @Post('accept')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept an invite to join a chama' })
  @ApiResponse({ 
    status: 200, 
    description: 'Invite accepted successfully',
    type: MembershipEntity
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired invite' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invite not found' })
  @ApiResponse({ status: 409, description: 'Already a member of this chama' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async acceptInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<MembershipEntity> {
    try {
      const membership = await this.inviteService.validateAndAcceptInvite(
        acceptInviteDto.token,
        currentUser.id,
      );
      return new MembershipEntity(membership);
    } catch (error) {
      this.handleError(error, 'Failed to accept invite');
    }
  }

  /**
   * Gets all pending invites for the current user
   */
  @Get('pending')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending invites for the current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of pending invites',
    type: [InviteEntity]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getPendingInvitesForUser(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<InviteEntity[]> {
    if (!currentUser.email) {
      throw new BadRequestException('User does not have an email address');
    }
    
    try {
      const invites = await this.inviteService.getPendingInvitesForUser(currentUser.email);
      return invites.map(invite => new InviteEntity(invite));
    } catch (error) {
      this.handleError(error, 'Failed to get pending invites');
    }
  }

  /**
   * Common error handler for controller methods
   */
  private handleError(error: any, defaultMessage: string): never {
    if (error instanceof HttpException) {
      throw error;
    }
    
    throw new InternalServerErrorException(
      `${defaultMessage}: ${error.message || 'Unknown error'}`
    );
  }
}
