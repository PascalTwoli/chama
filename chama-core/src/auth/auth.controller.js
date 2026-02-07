'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const login_dto_1 = require('../user/dto/login.dto');
const register_user_dto_1 = require('../user/dto/register-user.dto');
const user_service_1 = require('../user/user.service');
const auth_guard_1 = require('../guards/auth.guard');
const current_user_decorator_1 = require('../decorators/current-user.decorator');
const user_entity_1 = require('../user/entities/user.entity');
let AuthController = class AuthController {
  constructor(userService) {
    this.userService = userService;
  }
  /**
   * Register a new user
   */
  registerUser(registerUserDto) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        return yield this.userService.registerUser(registerUserDto);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new common_1.BadRequestException(
          `Registration failed: ${message}`,
        );
      }
    });
  }
  /**
   * Authenticate a user
   */
  login(loginDto) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        return yield this.userService.loginUser(loginDto);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new common_1.BadRequestException(
          `Authentication failed: ${message}`,
        );
      }
    });
  }
  /**
   * Refresh authentication token
   */
  refreshAuth(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!refreshToken) {
        throw new common_1.BadRequestException('Refresh token is required');
      }
      try {
        return yield this.userService.refreshAuthToken(refreshToken);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new common_1.BadRequestException(
          `Token refresh failed: ${message}`,
        );
      }
    });
  }
  /**
   * Get current logged in user information
   */
  getCurrentUser(currentUser) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        // Use the current user's Firebase UID to get complete user details
        const userResponse = yield this.userService.findOne(
          currentUser.firebaseUid,
        );
        // Transform to entity instance
        return new user_entity_1.UserResponseEntity({
          localUser: userResponse.localUser,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new common_1.BadRequestException(
          `Failed to fetch current user: ${message}`,
        );
      }
    });
  }
};
exports.AuthController = AuthController;
__decorate(
  [
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({
      summary: 'Register a new user',
      description: 'Creates a new user account with the provided information',
    }),
    (0, swagger_1.ApiBody)({ type: register_user_dto_1.RegisterUserDto }),
    (0, swagger_1.ApiCreatedResponse)({
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
    }),
    (0, swagger_1.ApiBadRequestResponse)({
      description: 'Invalid registration data or user already exists',
    }),
    (0, common_1.UsePipes)(
      new common_1.ValidationPipe({ transform: true, whitelist: true }),
    ),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [register_user_dto_1.RegisterUserDto]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'registerUser',
  null,
);
__decorate(
  [
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
      summary: 'Authenticate a user',
      description: 'Authenticates a user with email and password',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiOkResponse)({
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
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
      description: 'Invalid credentials',
    }),
    (0, common_1.UsePipes)(
      new common_1.ValidationPipe({ transform: true, whitelist: true }),
    ),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [login_dto_1.LoginDto]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'login',
  null,
);
__decorate(
  [
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
      summary: 'Refresh authentication token',
      description: 'Generates a new authentication token using a refresh token',
    }),
    (0, swagger_1.ApiQuery)({
      name: 'refreshToken',
      required: true,
      type: String,
      description: 'Refresh token obtained during login or registration',
    }),
    (0, swagger_1.ApiOkResponse)({
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
    }),
    (0, swagger_1.ApiBadRequestResponse)({
      description: 'Invalid or expired refresh token',
    }),
    __param(0, (0, common_1.Query)('refreshToken')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'refreshAuth',
  null,
);
__decorate(
  [
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
      summary: 'Get current user information',
      description:
        'Returns the current authenticated user information including both Firebase and local user details',
    }),
    (0, swagger_1.ApiOkResponse)({
      description: 'Current user information',
      type: user_entity_1.UserResponseEntity,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
      description: 'User not authenticated',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  AuthController.prototype,
  'getCurrentUser',
  null,
);
exports.AuthController = AuthController = __decorate(
  [
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata('design:paramtypes', [user_service_1.UserService]),
  ],
  AuthController,
);
