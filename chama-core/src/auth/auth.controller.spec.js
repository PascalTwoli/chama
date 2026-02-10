'use strict';
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
const testing_1 = require('@nestjs/testing');
const auth_controller_1 = require('./auth.controller');
const user_service_1 = require('../user/user.service');
const auth_guard_1 = require('../guards/auth.guard');
const common_1 = require('@nestjs/common');
const user_entity_1 = require('../user/entities/user.entity');
describe('AuthController', () => {
  let controller;
  let userService;
  const mockUserService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    refreshAuthToken: jest.fn(),
    findOne: jest.fn(),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };
  beforeEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      const module = yield testing_1.Test.createTestingModule({
        controllers: [auth_controller_1.AuthController],
        providers: [
          {
            provide: user_service_1.UserService,
            useValue: mockUserService,
          },
        ],
      })
        .overrideGuard(auth_guard_1.AuthGuard)
        .useValue(mockAuthGuard)
        .compile();
      controller = module.get(auth_controller_1.AuthController);
      userService = module.get(user_service_1.UserService);
    }),
  );
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getCurrentUser', () => {
    it('should return current user information', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const mockCurrentUser = {
          id: 'user123',
          firebaseUid: 'firebase123',
          email: 'test@example.com',
          displayName: 'Test User',
        };
        const mockUserResponse = {
          firebaseUser: {
            uid: 'firebase123',
            email: 'test@example.com',
            displayName: 'Test User',
            phoneNumber: '+1234567890',
            emailVerified: true,
          },
          localUser: {
            id: 'user123',
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            activeUserType: 'MEMBER',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        mockUserService.findOne.mockResolvedValue(mockUserResponse);
        const result = yield controller.getCurrentUser(mockCurrentUser);
        expect(userService.findOne).toHaveBeenCalledWith(
          mockCurrentUser.firebaseUid,
        );
        expect(result).toBeInstanceOf(user_entity_1.UserResponseEntity);
        expect(result.firebaseUser).toBeDefined();
        expect(result.localUser).toBeDefined();
        expect(
          (_a = result.firebaseUser) === null || _a === void 0
            ? void 0
            : _a.uid,
        ).toBe('firebase123');
        expect(result.localUser.id).toBe('user123');
      }));
    it('should throw BadRequestException when user service fails', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const mockCurrentUser = {
          id: 'user123',
          firebaseUid: 'firebase123',
          email: 'test@example.com',
          displayName: 'Test User',
        };
        mockUserService.findOne.mockRejectedValue(new Error('User not found'));
        yield expect(
          controller.getCurrentUser(mockCurrentUser),
        ).rejects.toThrow(common_1.BadRequestException);
        yield expect(
          controller.getCurrentUser(mockCurrentUser),
        ).rejects.toThrow('Failed to fetch current user: User not found');
      }));
    it('should handle user response without Firebase user', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const mockCurrentUser = {
          id: 'user123',
          firebaseUid: 'firebase123',
          email: 'test@example.com',
          displayName: 'Test User',
        };
        const mockUserResponse = {
          firebaseUser: null,
          localUser: {
            id: 'user123',
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            activeUserType: 'MEMBER',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        mockUserService.findOne.mockResolvedValue(mockUserResponse);
        const result = yield controller.getCurrentUser(mockCurrentUser);
        expect(result).toBeInstanceOf(user_entity_1.UserResponseEntity);
        expect(result.firebaseUser).toBeUndefined();
        expect(result.localUser).toBeDefined();
        expect(
          (_a = result.localUser) === null || _a === void 0 ? void 0 : _a.id,
        ).toBe('user123');
      }));
  });
});
