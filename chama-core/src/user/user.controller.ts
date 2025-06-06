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
  UseGuards,
  ValidationPipe,
  UsePipes,
  ClassSerializerInterceptor,
  UseInterceptors,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as firebaseAdmin from 'firebase-admin';
import { UserType } from 'generated/prisma';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListResponse, UserService } from './user.service';
import { UserEntity, FirebaseUserEntity, UserResponseEntity } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
  excludePrefixes: ['_'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Gets all users in the system
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users in the system',
  })
  @ApiOkResponse({
    description: 'List of users',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/FirebaseUserEntity',
          },
        },
        pageToken: { type: 'string', description: 'Token for pagination' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to view all users' })
  async findAll(@CurrentUser() currentUser: CurrentUserType): Promise<{users: FirebaseUserEntity[], pageToken?: string}> {
    try {
      // For admin functionality, you might want to verify the user has admin permissions
      const response = await this.userService.findAll();
      
      // Transform Firebase UserRecord objects to FirebaseUserEntity instances
      return {
        users: response.users.map(user => new FirebaseUserEntity({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          emailVerified: user.emailVerified
        })),
        pageToken: response.pageToken
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Gets a user by ID
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns detailed information about a specific user',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiOkResponse({
    description: 'User details',
    type: UserResponseEntity
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  async findOne(@Param('id') id: string): Promise<UserResponseEntity> {
    try {
      const userResponse = await this.userService.findOne(id);
      
      // Transform to entity instance
      return new UserResponseEntity({
        firebaseUser: userResponse.firebaseUser ? {
          uid: userResponse.firebaseUser.uid,
          email: userResponse.firebaseUser.email,
          displayName: userResponse.firebaseUser.displayName,
          phoneNumber: userResponse.firebaseUser.phoneNumber,
          emailVerified: userResponse.firebaseUser.emailVerified
        } : undefined,
        localUser: userResponse.localUser
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Updates a user's information
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates a user\'s information',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: FirebaseUserEntity
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to update this user' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<FirebaseUserEntity> {
    console.log('=== PATCH /user/:id endpoint called ===');
    console.log('Request ID:', id);
    console.log('Request body (updateUserDto):', updateUserDto);
    console.log('Current user from token:', {
      id: currentUser?.id,
      email: currentUser?.email,
      firebaseUid: currentUser?.firebaseUid,
      fullUser: currentUser
    });
    
    try {
      // Check if the user is updating their own profile or has admin privileges
      // Allow both currentUser.id and currentUser.firebaseUid to match the requested id
      if (currentUser.id !== id && currentUser.firebaseUid !== id) {
        console.log('=== AUTHORIZATION FAILED ===');
        console.log('- currentUser.id:', currentUser.id);
        console.log('- currentUser.firebaseUid:', currentUser.firebaseUid);
        console.log('- requested id:', id);
        console.log('- Neither currentUser.id nor currentUser.firebaseUid matches the requested id');
        throw new ForbiddenException('You are not authorized to update this user');
      }
      
      console.log('=== AUTHORIZATION PASSED ===');
      console.log('Proceeding with user update...');
      
      console.log('Calling userService.update with id:', id, 'and data:', updateUserDto);
      const userRecord = await this.userService.update(id, updateUserDto);
      console.log('userService.update result:', userRecord);
      
      // Transform to entity instance
      return new FirebaseUserEntity({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        emailVerified: userRecord.emailVerified
      });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Deletes a user
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user from the system',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiForbiddenResponse({ description: 'User not authorized to delete this user' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<{ message: string }> {
    try {
      // Check if the user is deleting their own profile or has admin privileges
      if (currentUser.id !== id) {
        // In a real app, you'd check if the user has admin permissions here
        throw new ForbiddenException('You are not authorized to delete this user');
      }
      
      await this.userService.remove(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete user: ${error.message}`);
    }
  }
}
