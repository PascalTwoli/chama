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
exports.AuthGuard = void 0;
const common_1 = require('@nestjs/common');
const user_service_1 = require('../user/user.service');
const prisma_service_1 = require('../prisma/prisma.service');
let AuthGuard = class AuthGuard {
  constructor(userService, prismaService) {
    this.userService = userService;
    this.prismaService = prismaService;
  }
  canActivate(context) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const request = context.switchToHttp().getRequest();
      // Inject PrismaService into the request
      request.prisma = this.prismaService;
      // Extract token with fallback strategy:
      // 1. Authorization: Bearer <token> header (priority)
      // 2. auth_token cookie (fallback)
      // 3. admin_token cookie (for admin routes)
      let token = null;
      // Try to get token from Authorization header first
      const authHeader = request.headers['authorization'];
      if (authHeader) {
        const [bearer, headerToken] = authHeader.split(' ');
        if (bearer === 'Bearer' && headerToken) {
          token = headerToken;
        }
      }
      // If no valid Authorization header, try cookies
      if (!token && request.cookies) {
        // Try auth_token cookie first
        token = request.cookies['auth_token'];
        // If no auth_token and this might be an admin route, try admin_token
        if (
          !token &&
          ((_a = request.url) === null || _a === void 0
            ? void 0
            : _a.includes('/admin'))
        ) {
          token = request.cookies['admin_token'];
        }
      }
      // If still no token found, deny access
      if (!token) {
        throw new common_1.UnauthorizedException(
          'Authentication required: No valid token found in Authorization header or cookies',
        );
      }
      // Create a modified request with the Authorization header for validation
      const modifiedRequest = Object.assign(Object.assign({}, request), {
        headers: Object.assign(Object.assign({}, request.headers), {
          authorization: `Bearer ${token}`,
        }),
      });
      // Validate token using UserService
      const decodedToken =
        yield this.userService.validateRequestAndGetToken(modifiedRequest);
      if (!decodedToken) {
        throw new common_1.UnauthorizedException('Token verification failed');
      }
      // Attach decoded token to request
      request.decodedToken = decodedToken;
      return true;
    });
  }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [
      user_service_1.UserService,
      prisma_service_1.PrismaService,
    ]),
  ],
  AuthGuard,
);
