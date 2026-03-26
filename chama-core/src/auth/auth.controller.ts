import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from '../user/dto/login.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginResponse } from '../user/user.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { UserResponseEntity } from '../user/entities/user.entity';

/**
 * Interface for token refresh response
 */
interface TokenRefreshResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  /**
   * Register a new user
   */
  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided information',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        idToken: { type: 'string', description: 'Authentication token' },
        refreshToken: {
          type: 'string',
          description: 'Token for refreshing authentication',
        },
        expiresIn: {
          type: 'string',
          description: 'Token expiration time in seconds',
        },
        user: {
          type: 'object',
          properties: {
            localUser: { type: 'object', description: 'Local user details' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data or user already exists',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<LoginResponse> {
    try {
      return await this.userService.registerUser(registerUserDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Registration failed: ${message}`);
    }
  }

  /**
   * Authenticate a user
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate a user',
    description: 'Authenticates a user with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User successfully authenticated',
    schema: {
      type: 'object',
      properties: {
        idToken: { type: 'string', description: 'Authentication token' },
        refreshToken: {
          type: 'string',
          description: 'Token for refreshing authentication',
        },
        expiresIn: {
          type: 'string',
          description: 'Token expiration time in seconds',
        },
        user: {
          type: 'object',
          properties: {
            localUser: { type: 'object', description: 'Local user details' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      return await this.userService.loginUser(loginDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Authentication failed: ${message}`);
    }
  }

  /**
   * Refresh authentication token
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh authentication token',
    description: 'Generates a new authentication token using a refresh token',
  })
  @ApiQuery({
    name: 'refreshToken',
    required: true,
    type: String,
    description: 'Refresh token obtained during login or registration',
  })
  @ApiOkResponse({
    description: 'Token successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        idToken: { type: 'string', description: 'New authentication token' },
        refreshToken: { type: 'string', description: 'New refresh token' },
        expiresIn: {
          type: 'string',
          description: 'Token expiration time in seconds',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired refresh token' })
  async refreshAuth(
    @Query('refreshToken') refreshToken: string,
  ): Promise<TokenRefreshResponse> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    try {
      return await this.userService.refreshAuthToken(refreshToken);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Token refresh failed: ${message}`);
    }
  }

  /**
   * Logout user (client-side token cleanup)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Endpoint for client to signal logout (tokens are managed client-side)',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout successful' },
      },
    },
  })
  async logout(): Promise<{ message: string }> {
    // Since tokens are managed client-side (cookies/localStorage),
    // this endpoint just acknowledges the logout request
    // The client is responsible for clearing tokens
    return { message: 'Logout successful' };
  }

  /**
   * Verify and handle Google authentication
   * Detects existing email/password accounts and prevents Firebase UID mismatches
   */
  @Post('verify-google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Google authentication and check for existing accounts',
    description:
      'Verifies Google ID token and detects if an email/password account exists. ' +
      'Returns information needed for proper account linking or new user creation.',
  })
  @ApiBody({
    type: String,
    description: 'Firebase ID token from Google sign-in',
  })
  @ApiOkResponse({
    description: 'Google token verified',
    schema: {
      type: 'object',
      properties: {
        uid: { type: 'string', description: 'Firebase UID from Google token' },
        email: { type: 'string', description: 'Email from Google token' },
        name: { type: 'string', description: 'Display name from Google token' },
        passwordAccountExists: {
          type: 'boolean',
          description:
            'Whether a password-based account exists with this email',
        },
        accountLinkingNeeded: {
          type: 'boolean',
          description:
            'Whether the accounts need to be linked (different Firebase UIDs)',
        },
        existingUid: {
          type: 'string',
          description:
            'Firebase UID of existing account if different from Google UID',
        },
      },
    },
  })
  async verifyGoogle(@Body() body: { infoToken: string }): Promise<any> {
    try {
      // Verify the Google ID token
      const decodedToken = await firebaseAdmin
        .auth()
        .verifyIdToken(body.infoToken);

      // Extract user info from token
      const { uid, email, name } = decodedToken;

      // Email should be present in Google token, but check just in case
      if (!email) {
        throw new BadRequestException(
          'Google account does not have email information',
        );
      }

      // Check if a local user exists with this email
      const existingUser = await this.userService.getUserByEmail(email);

      // Return verification result
      return {
        uid,
        email,
        name,
        passwordAccountExists: !!existingUser,
        accountLinkingNeeded: existingUser && existingUser.id !== uid,
        existingUid: existingUser?.id,
        message: existingUser
          ? 'Account with this email already exists'
          : 'New account will be created',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Google verification failed: ${message}`);
    }
  }

  /**
   * Check account provider status
   * Helps diagnose why password auth is failing (e.g., due to linked providers)
   */
  @Post('check-providers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check authentication providers for an email',
    description:
      'Returns which authentication providers (password, Google, etc.) are available for a given email. ' +
      'Useful for diagnosing why certain sign-in methods are failing.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Provider information retrieved',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        hasPassword: {
          type: 'boolean',
          description: 'Whether email/password auth is available',
        },
        hasGoogle: {
          type: 'boolean',
          description: 'Whether Google OAuth is linked',
        },
        hasOtherProviders: {
          type: 'boolean',
          description: 'Whether other providers are linked',
        },
        availableProviders: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of all available auth providers',
        },
        message: { type: 'string' },
      },
    },
  })
  async checkProviders(
    @Body() body: { email: string },
  ): Promise<{
    email: string;
    hasPassword: boolean;
    hasGoogle: boolean;
    hasOtherProviders: boolean;
    availableProviders: string[];
    message: string;
  }> {
    try {
      if (!body.email || typeof body.email !== 'string') {
        throw new BadRequestException('Valid email is required');
      }

      // Use the user service to check providers
      // Note: We'll need to expose this method from userService for this to work
      const result = await this.userService.checkAuthProvidersForEmail(
        body.email,
      );
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Providers check failed: ${message}`);
    }
  }

  /**
   * Get current logged in user information
   */
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current user information',
    description:
      'Returns the current authenticated user information including both Firebase and local user details',
  })
  @ApiOkResponse({
    description: 'Current user information',
    type: UserResponseEntity,
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  async getCurrentUser(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<UserResponseEntity> {
    try {
      // Use the current user's Firebase UID to get complete user details
      const userResponse = await this.userService.findOne(
        currentUser.firebaseUid,
      );

      // Transform to entity instance
      return new UserResponseEntity({
        localUser: userResponse.localUser,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch current user: ${message}`);
    }
  }
}
