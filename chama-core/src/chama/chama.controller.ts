import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
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

/**
 * Interface for Chama response with membership details
 */
interface ChamaResponse {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  memberships: {
    id: string;
    chamaId: string;
    userId: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
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
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Failed to create chama: ${error.message}`);
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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch chamas: ${error.message}`,
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch chama: ${error.message}`,
      );
    }
  }
}
