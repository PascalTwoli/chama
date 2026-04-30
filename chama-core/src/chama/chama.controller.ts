import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
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
import { ChamaService } from './chama.service';
import { CreateChamaDto } from './dto/create-chama.dto';
import { user_role, country } from '@prisma/client';

/**
 * Interface for Chama response with membership details
 * Matches Prisma's snake_case field names
 */
interface ChamaResponse {
  id: string;
  name: string;
  description: string | null;
  rules: string | null;
  created_by: string;
  createdAt: Date;
  updatedAt: Date;
  country: country;
  members_count: number;
  organization_role: user_role | null;
  membership: Array<{
    id: string;
    chama_id: string;
    user_id: string;
    role: user_role;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

/**
 * Interface for available chama response (for non-members)
 */
interface AvailableChamaResponse {
  id: string;
  name: string;
  description: string | null;
  membersCount: number;
  country: country;
  createdAt: Date;
  updatedAt: Date;
  adminName: string | null;
}

@ApiTags('Chama')
@Controller('chama')
export class ChamaController {
  constructor(private readonly chamaService: ChamaService) {}

  /**
   * Creates a new chama group
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new chama' })
  @ApiBody({ type: CreateChamaDto })
  @ApiCreatedResponse({
    description: 'The chama has been successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique chama identifier' },
        name: { type: 'string', description: 'Name of the chama' },
        description: {
          type: 'string',
          description: 'Description of the chama',
        },
        userId: { type: 'string', description: 'ID of the creator' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp',
        },
        memberships: {
          type: 'array',
          description: 'List of users who are members of this chama',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Membership ID' },
              chamaId: { type: 'string', description: 'Chama ID' },
              userId: { type: 'string', description: 'User ID' },
              role: {
                type: 'string',
                description: 'Role in the chama (ADMIN, MEMBER)',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Membership creation date',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Membership last update date',
              },
            },
          },
        },
      },
    },
  })
  async create(
    @Body() createChamaDto: CreateChamaDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ChamaResponse> {
    try {
      return await this.chamaService.create(createChamaDto, currentUser.id);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create chama: ${message}`);
    }
  }

  /**
   * Gets all chamas for the current user
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all chamas for the logged-in user' })
  @ApiOkResponse({
    description: 'List of chamas the user is a member of',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique chama identifier' },
          name: { type: 'string', description: 'Name of the chama' },
          description: {
            type: 'string',
            description: 'Description of the chama',
          },
          userId: { type: 'string', description: 'ID of the creator' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
          memberships: {
            type: 'array',
            description: 'List of users who are members of this chama',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Membership ID' },
                chamaId: { type: 'string', description: 'Chama ID' },
                userId: { type: 'string', description: 'User ID' },
                role: {
                  type: 'string',
                  description: 'Role in the chama (ADMIN, MEMBER)',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Membership creation date',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Membership last update date',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not authenticated',
  })
  async findAll(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ChamaResponse[]> {
    try {
      return await this.chamaService.findAll(currentUser.id);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch chamas: ${message}`,
      );
    }
  }

  /**
   * Gets all available chamas (public chamas that users can join)
   */
  @Get('available')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all available chamas that users can join' })
  @ApiOkResponse({
    description: 'List of all available chamas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique chama identifier' },
          name: { type: 'string', description: 'Name of the chama' },
          description: {
            type: 'string',
            description: 'Description of the chama',
          },
          userId: { type: 'string', description: 'ID of the creator' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
          membersCount: { type: 'number', description: 'Number of members' },
          country: { type: 'string', description: 'Country of the chama' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not authenticated',
  })
  async findAllAvailable(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<AvailableChamaResponse[]> {
    try {
      return await this.chamaService.findAllAvailable(currentUser.id);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch available chamas: ${message}`,
      );
    }
  }

  /**
   * Gets all members of a specific chama
   */
  @Get(':id/members')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all members of a chama' })
  @ApiParam({ name: 'id', description: 'Chama ID' })
  @ApiOkResponse({
    description: 'List of chama members',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Membership ID' },
          userId: { type: 'string', description: 'User ID' },
          role: { type: 'string', description: 'Member role' },
          joinedAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Chama not found' })
  async getChamaMembers(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.chamaService.getChamaMembers(id, currentUser.id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch chama members: ${message}`,
      );
    }
  }

  /**
   * Gets a specific chama by ID
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a chama by ID' })
  @ApiParam({ name: 'id', description: 'Chama ID', type: 'string' })
  @ApiOkResponse({
    description: 'The requested chama',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique chama identifier' },
        name: { type: 'string', description: 'Name of the chama' },
        description: {
          type: 'string',
          description: 'Description of the chama',
        },
        userId: { type: 'string', description: 'ID of the creator' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp',
        },
        memberships: {
          type: 'array',
          description: 'List of users who are members of this chama',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Membership ID' },
              chamaId: { type: 'string', description: 'Chama ID' },
              userId: { type: 'string', description: 'User ID' },
              role: {
                type: 'string',
                description: 'Role in the chama (ADMIN, MEMBER)',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Membership creation date',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Membership last update date',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not authenticated',
  })
  @ApiNotFoundResponse({
    description: 'Chama not found or user does not have access',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<ChamaResponse> {
    try {
      return await this.chamaService.findOne(id, currentUser.id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch chama: ${message}`,
      );
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update chama name or description (owner only)' })
  @ApiParam({ name: 'id', description: 'Chama ID', type: 'string' })
  @ApiOkResponse({ description: 'Chama updated successfully' })
  async updateChama(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.chamaService.updateChama(id, currentUser.id, body);
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to update chama: ${message}`);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chama and all its data (owner only)' })
  @ApiParam({ name: 'id', description: 'Chama ID', type: 'string' })
  async deleteChama(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<void> {
    try {
      await this.chamaService.deleteChama(id, currentUser.id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Failed to delete chama: ${message}`);
    }
  }
}
