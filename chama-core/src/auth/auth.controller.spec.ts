import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { BadRequestException } from '@nestjs/common';
import { UserResponseEntity } from '../user/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;

  const mockUserService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    refreshAuthToken: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return current user information', async () => {
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

      const result = await controller.getCurrentUser(mockCurrentUser);

      expect(userService.findOne).toHaveBeenCalledWith(
        mockCurrentUser.firebaseUid,
      );
      expect(result).toBeInstanceOf(UserResponseEntity);
      expect(result.localUser).toBeDefined();
      expect(result.localUser.id).toBe('user123');
    });

    it('should throw BadRequestException when user service fails', async () => {
      const mockCurrentUser = {
        id: 'user123',
        firebaseUid: 'firebase123',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockUserService.findOne.mockRejectedValue(new Error('User not found'));

      await expect(controller.getCurrentUser(mockCurrentUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.getCurrentUser(mockCurrentUser)).rejects.toThrow(
        'Failed to fetch current user: User not found',
      );
    });

    it('should handle user response without Firebase user', async () => {
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

      const result = await controller.getCurrentUser(mockCurrentUser);

      expect(result).toBeInstanceOf(UserResponseEntity);
      expect(result.localUser).toBeDefined();
      expect(result.localUser?.id).toBe('user123');
    });
  });
});
