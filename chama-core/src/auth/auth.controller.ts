import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../user/dto/login.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginResponse } from '../user/user.service';
import { UserService } from '../user/user.service';

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
        refreshToken: { type: 'string', description: 'Token for refreshing authentication' },
        expiresIn: { type: 'string', description: 'Token expiration time in seconds' },
        user: {
          type: 'object',
          properties: {
            firebaseUser: { type: 'object', description: 'Firebase user details' },
            localUser: { type: 'object', description: 'Local user details' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid registration data or user already exists' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    try {
      return await this.userService.registerUser(registerUserDto);
    } catch (error) {
      throw new BadRequestException(`Registration failed: ${error.message}`);
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
        refreshToken: { type: 'string', description: 'Token for refreshing authentication' },
        expiresIn: { type: 'string', description: 'Token expiration time in seconds' },
        user: {
          type: 'object',
          properties: {
            firebaseUser: { type: 'object', description: 'Firebase user details' },
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
    } catch (error) {
      throw new BadRequestException(`Authentication failed: ${error.message}`);
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
        expiresIn: { type: 'string', description: 'Token expiration time in seconds' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired refresh token' })
  async refreshAuth(@Query('refreshToken') refreshToken: string): Promise<TokenRefreshResponse> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    try {
      return await this.userService.refreshAuthToken(refreshToken);
    } catch (error) {
      throw new BadRequestException(`Token refresh failed: ${error.message}`);
    }
  }
}
