import { Test, TestingModule } from '@nestjs/testing';
import { JoinRequestService } from './join-request.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as fc from 'fast-check';
import { join_request_status, user_role } from '@prisma/client';

describe('JoinRequestService', () => {
  let service: JoinRequestService;

  const mockPrismaService = {
    chama: {
      findUnique: jest.fn(),
    },
    membership: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    join_request: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinRequestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<JoinRequestService>(JoinRequestService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Feature: chama-member-join-requests, Property 1: Join Request Creation Completeness', () => {
    /**
     * **Validates: Requirements 1.1, 1.2, 1.5**
     *
     * Property: For any valid user and chama combination, when a join request is created,
     * the system should persist a record with status PENDING, all required fields
     * (chamaId, userId, message, createdAt), and the record should be immediately
     * retrievable from the database.
     */
    it('should create join request with all required fields and PENDING status', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.option(fc.string({ maxLength: 500 }), { nil: undefined }), // optional message
          async (userId, chamaId, message) => {
            // Setup: Mock chama exists
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);

            // Setup: No existing membership
            mockPrismaService.membership.findFirst.mockResolvedValue(null);

            // Setup: No existing pending request
            mockPrismaService.join_request.findFirst.mockResolvedValue(null);

            // Setup: Mock successful creation
            const mockCreatedRequest = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: message,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };
            mockPrismaService.join_request.create.mockResolvedValue(
              mockCreatedRequest,
            );

            // Execute: Create join request
            const result = await service.createJoinRequest(userId, {
              chamaId,
              message: message ?? undefined,
            });

            // Verify: All required fields are present
            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.chama_id).toBe(chamaId);
            expect(result.user_id).toBe(userId);
            expect(result.status).toBe(join_request_status.PENDING);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);

            // Verify: Message field is correctly set (present or null)
            if (message !== null) {
              expect(result.message).toBe(message);
            } else {
              expect(result.message).toBeNull();
            }

            // Verify: Chama validation was performed
            expect(mockPrismaService.chama.findUnique).toHaveBeenCalledWith({
              where: { id: chamaId },
            });

            // Verify: Membership check was performed
            expect(mockPrismaService.membership.findFirst).toHaveBeenCalledWith(
              {
                where: {
                  chama_id: chamaId,
                  user_id: userId,
                },
              },
            );

            // Verify: Pending request check was performed
            expect(
              mockPrismaService.join_request.findFirst,
            ).toHaveBeenCalledWith({
              where: {
                chama_id: chamaId,
                user_id: userId,
                status: join_request_status.PENDING,
              },
            });

            // Verify: Create was called with correct data
            expect(mockPrismaService.join_request.create).toHaveBeenCalledWith(
              expect.objectContaining({
                data: expect.objectContaining({
                  chama_id: chamaId,
                  user_id: userId,
                  status: join_request_status.PENDING,
                  message: message ?? undefined,
                }),
              }),
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 2: Duplicate Request Prevention', () => {
    /**
     * **Validates: Requirements 1.3, 6.1**
     *
     * Property: For any user and chama combination, if a PENDING join request already exists,
     * attempting to create another join request should be rejected with an error.
     */
    it('should reject duplicate pending requests for the same user and chama', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.option(fc.string({ maxLength: 500 }), { nil: undefined }), // optional message for first request
          fc.option(fc.string({ maxLength: 500 }), { nil: undefined }), // optional message for second request
          async (userId, chamaId, firstMessage, secondMessage) => {
            // Setup: Mock chama exists
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);

            // Setup: No existing membership
            mockPrismaService.membership.findFirst.mockResolvedValue(null);

            // Setup: First call - no existing pending request
            mockPrismaService.join_request.findFirst.mockResolvedValueOnce(
              null,
            );

            // Setup: Mock successful first creation
            const mockFirstRequest = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: firstMessage,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };
            mockPrismaService.join_request.create.mockResolvedValueOnce(
              mockFirstRequest,
            );

            // Execute: Create first join request (should succeed)
            const firstResult = await service.createJoinRequest(userId, {
              chamaId,
              message: firstMessage ?? undefined,
            });

            // Verify: First request was created successfully
            expect(firstResult).toBeDefined();
            expect(firstResult.status).toBe(join_request_status.PENDING);

            // Setup: Second call - existing pending request found
            mockPrismaService.join_request.findFirst.mockResolvedValue(
              mockFirstRequest,
            );

            // Execute & Verify: Attempt to create duplicate request should throw ConflictException
            await expect(
              service.createJoinRequest(userId, {
                chamaId,
                message: secondMessage ?? undefined,
              }),
            ).rejects.toThrow(ConflictException);

            // Verify: The error message indicates duplicate pending request
            await expect(
              service.createJoinRequest(userId, {
                chamaId,
                message: secondMessage ?? undefined,
              }),
            ).rejects.toThrow(
              'You already have a pending join request for this chama',
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 3: Member Request Prevention', () => {
    /**
     * **Validates: Requirements 1.4**
     *
     * Property: For any user who is already a member of a chama, attempting to create
     * a join request for that chama should be rejected with an error.
     */
    it('should reject join requests from users who are already members', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.option(fc.string({ maxLength: 500 }), { nil: undefined }), // optional message
          async (userId, chamaId, message) => {
            // Setup: Mock chama exists
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);

            // Setup: User is already a member
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              role: 'MEMBER',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Execute & Verify: Attempt to create join request should throw ConflictException
            await expect(
              service.createJoinRequest(userId, {
                chamaId,
                message: message ?? undefined,
              }),
            ).rejects.toThrow(ConflictException);

            // Verify: The error message indicates user is already a member
            await expect(
              service.createJoinRequest(userId, {
                chamaId,
                message: message ?? undefined,
              }),
            ).rejects.toThrow('You are already a member of this chama');

            // Verify: Chama validation was performed
            expect(mockPrismaService.chama.findUnique).toHaveBeenCalledWith({
              where: { id: chamaId },
            });

            // Verify: Membership check was performed
            expect(mockPrismaService.membership.findFirst).toHaveBeenCalledWith(
              {
                where: {
                  chama_id: chamaId,
                  user_id: userId,
                },
              },
            );

            // Verify: Join request creation was never attempted
            expect(
              mockPrismaService.join_request.create,
            ).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('createJoinRequest edge cases', () => {
    /**
     * **Validates: Requirements 1.1, 1.2**
     *
     * Test creating a join request with a message
     */
    it('should create join request with message', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';
      const message = 'I would like to join your savings group';

      // Setup: Mock chama exists
      const mockChama = {
        id: chamaId,
        name: 'Test Chama',
        description: 'Test Description',
        rules: null,
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        country: 'KENYA',
        members_count: 1,
        organization_role: null,
      };
      mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);

      // Setup: No existing membership
      mockPrismaService.membership.findFirst.mockResolvedValue(null);

      // Setup: No existing pending request
      mockPrismaService.join_request.findFirst.mockResolvedValue(null);

      // Setup: Mock successful creation
      const mockCreatedRequest = {
        id: 'request-789',
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.PENDING,
        message: message,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: null,
        reviewed_at: null,
        user_join_request_user_idTouser: {
          id: userId,
          name: 'Test User',
          email: 'test@example.com',
        },
        chama: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Test Description',
        },
      };
      mockPrismaService.join_request.create.mockResolvedValue(
        mockCreatedRequest,
      );

      // Execute: Create join request with message
      const result = await service.createJoinRequest(userId, {
        chamaId,
        message,
      });

      // Verify: Request was created with message
      expect(result).toBeDefined();
      expect(result.message).toBe(message);
      expect(result.status).toBe(join_request_status.PENDING);
    });

    /**
     * **Validates: Requirements 1.1, 1.2**
     *
     * Test creating a join request without a message
     */
    it('should create join request without message', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';

      // Setup: Mock chama exists
      const mockChama = {
        id: chamaId,
        name: 'Test Chama',
        description: 'Test Description',
        rules: null,
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        country: 'KENYA',
        members_count: 1,
        organization_role: null,
      };
      mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);

      // Setup: No existing membership
      mockPrismaService.membership.findFirst.mockResolvedValue(null);

      // Setup: No existing pending request
      mockPrismaService.join_request.findFirst.mockResolvedValue(null);

      // Setup: Mock successful creation
      const mockCreatedRequest = {
        id: 'request-789',
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.PENDING,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: null,
        reviewed_at: null,
        user_join_request_user_idTouser: {
          id: userId,
          name: 'Test User',
          email: 'test@example.com',
        },
        chama: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Test Description',
        },
      };
      mockPrismaService.join_request.create.mockResolvedValue(
        mockCreatedRequest,
      );

      // Execute: Create join request without message
      const result = await service.createJoinRequest(userId, {
        chamaId,
      });

      // Verify: Request was created without message
      expect(result).toBeDefined();
      expect(result.message).toBeNull();
      expect(result.status).toBe(join_request_status.PENDING);
    });

    /**
     * **Validates: Requirements 6.2**
     *
     * Test error handling for non-existent chama
     */
    it('should throw NotFoundException for non-existent chama', async () => {
      const userId = 'user-123';
      const chamaId = 'non-existent-chama';

      // Setup: Mock chama does not exist
      mockPrismaService.chama.findUnique.mockResolvedValue(null);

      // Execute & Verify: Should throw NotFoundException
      await expect(
        service.createJoinRequest(userId, {
          chamaId,
        }),
      ).rejects.toThrow(NotFoundException);

      // Verify: Error message indicates chama not found
      await expect(
        service.createJoinRequest(userId, {
          chamaId,
        }),
      ).rejects.toThrow(`Chama with ID ${chamaId} not found`);

      // Verify: Chama validation was performed
      expect(mockPrismaService.chama.findUnique).toHaveBeenCalledWith({
        where: { id: chamaId },
      });

      // Verify: No further operations were attempted
      expect(mockPrismaService.membership.findFirst).not.toHaveBeenCalled();
      expect(mockPrismaService.join_request.findFirst).not.toHaveBeenCalled();
      expect(mockPrismaService.join_request.create).not.toHaveBeenCalled();
    });

    /**
     * **Validates: Requirements 6.3**
     *
     * Test error handling for non-existent user
     * Note: User validation is enforced by database foreign key constraints
     */
    it('should handle non-existent user error from database', async () => {
      const userId = 'non-existent-user';
      const chamaId = 'chama-456';

      // Setup: Mock chama exists
      const mockChama = {
        id: chamaId,
        name: 'Test Chama',
        description: 'Test Description',
        rules: null,
        created_by: 'creator-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        country: 'KENYA',
        members_count: 1,
        organization_role: null,
      };
      mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);

      // Setup: No existing membership
      mockPrismaService.membership.findFirst.mockResolvedValue(null);

      // Setup: No existing pending request
      mockPrismaService.join_request.findFirst.mockResolvedValue(null);

      // Setup: Mock database foreign key constraint error
      const foreignKeyError = new Error(
        'Foreign key constraint failed on the field: `user_id`',
      );
      foreignKeyError.name = 'PrismaClientKnownRequestError';
      mockPrismaService.join_request.create.mockRejectedValue(foreignKeyError);

      // Execute & Verify: Should handle database error gracefully
      await expect(
        service.createJoinRequest(userId, {
          chamaId,
        }),
      ).rejects.toThrow();

      // Verify: Create was attempted with the non-existent user
      expect(mockPrismaService.join_request.create).toHaveBeenCalled();
    });
  });

  describe('Feature: chama-member-join-requests, Property 6: Chairperson Authorization', () => {
    /**
     * **Validates: Requirements 2.3, 3.4, 4.4, 7.2**
     *
     * Property: For any user attempting to access chairperson-only endpoints
     * (view pending requests, approve, reject), the system should verify the user
     * has CHAIRPERSON role for the specified chama and reject non-chairpersons
     * with a 403 Forbidden error.
     */
    it('should reject non-chairpersons from accessing pending requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId (non-chairperson)
          fc.uuid(), // chamaId
          async (userId, chamaId) => {
            // Setup: User is not a chairperson (either not a member or has different role)
            const mockMembership = fc.sample(
              fc.constantFrom(
                null, // Not a member
                {
                  id: fc.sample(fc.uuid(), 1)[0],
                  chama_id: chamaId,
                  user_id: userId,
                  role: user_role.MEMBER,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: fc.sample(fc.uuid(), 1)[0],
                  chama_id: chamaId,
                  user_id: userId,
                  role: user_role.TREASURER,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ),
              1,
            )[0];
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Execute & Verify: Attempt to get pending requests should throw UnauthorizedException
            await expect(
              service.getPendingRequestsForChama(chamaId, userId),
            ).rejects.toThrow('Only chairpersons can perform this action');

            // Verify: Membership check was performed
            expect(mockPrismaService.membership.findFirst).toHaveBeenCalledWith(
              {
                where: {
                  chama_id: chamaId,
                  user_id: userId,
                },
              },
            );

            // Verify: No further operations were attempted
            expect(
              mockPrismaService.join_request.findMany,
            ).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should allow chairpersons to access pending requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId (chairperson)
          fc.uuid(), // chamaId
          async (userId, chamaId) => {
            // Setup: User is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock pending requests
            const mockRequests: any[] = [];
            mockPrismaService.join_request.findMany.mockResolvedValue(
              mockRequests,
            );

            // Execute: Get pending requests
            const result = await service.getPendingRequestsForChama(
              chamaId,
              userId,
            );

            // Verify: Request succeeded
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);

            // Verify: Membership check was performed
            expect(mockPrismaService.membership.findFirst).toHaveBeenCalledWith(
              {
                where: {
                  chama_id: chamaId,
                  user_id: userId,
                },
              },
            );

            // Verify: Query was executed
            expect(
              mockPrismaService.join_request.findMany,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                where: {
                  chama_id: chamaId,
                  status: join_request_status.PENDING,
                },
              }),
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 4: Pending Request Filtering', () => {
    /**
     * **Validates: Requirements 2.1**
     *
     * Property: For any chama with multiple join requests in various states,
     * when a chairperson requests pending requests, only requests with status
     * PENDING should be returned.
     */
    it('should return only PENDING requests when filtering', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // chairpersonId
          fc.uuid(), // chamaId
          fc.array(
            fc.record({
              userId: fc.uuid(),
              status: fc.constantFrom(
                join_request_status.PENDING,
                join_request_status.APPROVED,
                join_request_status.REJECTED,
              ),
            }),
            { minLength: 1, maxLength: 10 },
          ),
          async (chairpersonId, chamaId, requests) => {
            // Setup: User is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: chairpersonId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock only PENDING requests to be returned
            const pendingRequests = requests
              .filter(r => r.status === join_request_status.PENDING)
              .map((r, index) => ({
                id: fc.sample(fc.uuid(), 1)[0],
                chama_id: chamaId,
                user_id: r.userId,
                status: r.status,
                message: null,
                createdAt: new Date(Date.now() - index * 1000),
                updatedAt: new Date(),
                reviewed_by: null,
                reviewed_at: null,
                user_join_request_user_idTouser: {
                  id: r.userId,
                  name: 'Test User',
                  email: 'test@example.com',
                },
              }));

            mockPrismaService.join_request.findMany.mockResolvedValue(
              pendingRequests,
            );

            // Execute: Get pending requests
            const result = await service.getPendingRequestsForChama(
              chamaId,
              chairpersonId,
            );

            // Verify: All returned requests have PENDING status
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            result.forEach(request => {
              expect(request.status).toBe(join_request_status.PENDING);
            });

            // Verify: Count matches expected pending requests
            const expectedPendingCount = requests.filter(
              r => r.status === join_request_status.PENDING,
            ).length;
            expect(result.length).toBe(expectedPendingCount);

            // Verify: Query was executed with correct filter
            expect(
              mockPrismaService.join_request.findMany,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                where: {
                  chama_id: chamaId,
                  status: join_request_status.PENDING,
                },
              }),
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 7: Result Ordering', () => {
    /**
     * **Validates: Requirements 2.4, 5.3**
     *
     * Property: For any list of join requests returned by the API, the results
     * should be ordered by creation timestamp in descending order (newest first).
     */
    it('should return requests ordered by createdAt descending', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // chairpersonId
          fc.uuid(), // chamaId
          fc
            .array(fc.uuid(), { minLength: 2, maxLength: 10 })
            .map(userIds =>
              userIds.map((userId, index) => ({ userId, index })),
            ),
          async (chairpersonId, chamaId, users) => {
            // Setup: User is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: chairpersonId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Create requests with different timestamps (newest first)
            const baseTime = Date.now();
            const mockRequests = users.map((user, index) => ({
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: user.userId,
              status: join_request_status.PENDING,
              message: null,
              createdAt: new Date(baseTime - index * 60000), // Each request 1 minute apart
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: user.userId,
                name: 'Test User',
                email: 'test@example.com',
              },
            }));

            mockPrismaService.join_request.findMany.mockResolvedValue(
              mockRequests,
            );

            // Execute: Get pending requests
            const result = await service.getPendingRequestsForChama(
              chamaId,
              chairpersonId,
            );

            // Verify: Results are ordered by createdAt descending
            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThanOrEqual(2);

            for (let i = 0; i < result.length - 1; i++) {
              const currentTime = result[i].createdAt.getTime();
              const nextTime = result[i + 1].createdAt.getTime();
              expect(currentTime).toBeGreaterThanOrEqual(nextTime);
            }

            // Verify: Query included orderBy clause
            expect(
              mockPrismaService.join_request.findMany,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                orderBy: {
                  createdAt: 'desc',
                },
              }),
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('getPendingRequestsForChama edge cases', () => {
    /**
     * **Validates: Requirements 2.5**
     *
     * Test chama with no pending requests returns empty array
     */
    it('should return empty array when chama has no pending requests', async () => {
      const chairpersonId = 'chairperson-123';
      const chamaId = 'chama-456';

      // Setup: User is a chairperson
      const mockMembership = {
        id: 'membership-789',
        chama_id: chamaId,
        user_id: chairpersonId,
        role: user_role.CHAIRPERSON,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.membership.findFirst.mockResolvedValue(mockMembership);

      // Setup: No pending requests
      mockPrismaService.join_request.findMany.mockResolvedValue([]);

      // Execute: Get pending requests
      const result = await service.getPendingRequestsForChama(
        chamaId,
        chairpersonId,
      );

      // Verify: Empty array is returned
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);

      // Verify: Query was executed
      expect(mockPrismaService.join_request.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            chama_id: chamaId,
            status: join_request_status.PENDING,
          },
        }),
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 8: Approval State Transition', () => {
    /**
     * **Validates: Requirements 3.1, 3.2, 3.3**
     *
     * Property: For any PENDING join request, when a chairperson approves it,
     * the request status should change to APPROVED, a membership with role MEMBER
     * should be created for the requester, and the reviewer ID and review timestamp
     * should be recorded.
     */
    it('should transition to APPROVED, create membership, and record audit trail', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.uuid(), // reviewerId
          fc.uuid(), // requestId
          async (userId, chamaId, reviewerId, requestId) => {
            // Setup: Reviewer is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: reviewerId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock transaction
            const mockRequest = {
              id: requestId,
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
            };

            const mockUpdatedRequest = {
              ...mockRequest,
              status: join_request_status.APPROVED,
              reviewed_by: reviewerId,
              reviewed_at: new Date(),
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };

            const mockNewMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              role: user_role.MEMBER,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            mockPrismaService.$transaction.mockImplementation(
              async callback => {
                const tx = {
                  join_request: {
                    findUnique: jest.fn().mockResolvedValue(mockRequest),
                    update: jest.fn().mockResolvedValue(mockUpdatedRequest),
                  },
                  membership: {
                    findFirst: jest.fn().mockResolvedValue(null),
                    create: jest.fn().mockResolvedValue(mockNewMembership),
                  },
                };
                return callback(tx);
              },
            );

            // Execute: Approve request
            const result = await service.approveJoinRequest(
              requestId,
              reviewerId,
              chamaId,
            );

            // Verify: Status changed to APPROVED
            expect(result.joinRequest.status).toBe(
              join_request_status.APPROVED,
            );

            // Verify: Reviewer and timestamp recorded
            expect(result.joinRequest.reviewed_by).toBe(reviewerId);
            expect(result.joinRequest.reviewed_at).toBeDefined();
            expect(result.joinRequest.reviewed_at).toBeInstanceOf(Date);

            // Verify: Membership created with correct details
            expect(result.membership).toBeDefined();
            expect(result.membership.user_id).toBe(userId);
            expect(result.membership.chama_id).toBe(chamaId);
            expect(result.membership.role).toBe(user_role.MEMBER);

            // Verify: Chairperson verification was performed
            expect(mockPrismaService.membership.findFirst).toHaveBeenCalledWith(
              {
                where: {
                  chama_id: chamaId,
                  user_id: reviewerId,
                },
              },
            );

            // Verify: Transaction was used
            expect(mockPrismaService.$transaction).toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 9: Review State Validation', () => {
    /**
     * **Validates: Requirements 3.5, 4.5**
     *
     * Property: For any join request that is not in PENDING status, attempting
     * to approve or reject it should be rejected with an error.
     */
    it('should reject approval of non-PENDING requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.uuid(), // reviewerId
          fc.uuid(), // requestId
          fc.constantFrom(
            join_request_status.APPROVED,
            join_request_status.REJECTED,
          ), // non-PENDING status
          async (userId, chamaId, reviewerId, requestId, status) => {
            // Setup: Reviewer is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: reviewerId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock transaction with non-PENDING request
            const mockRequest = {
              id: requestId,
              chama_id: chamaId,
              user_id: userId,
              status: status,
              message: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: fc.sample(fc.uuid(), 1)[0],
              reviewed_at: new Date(),
            };

            mockPrismaService.$transaction.mockImplementation(
              async callback => {
                const tx = {
                  join_request: {
                    findUnique: jest.fn().mockResolvedValue(mockRequest),
                  },
                };
                return callback(tx);
              },
            );

            // Execute & Verify: Attempt to approve should throw ConflictException
            await expect(
              service.approveJoinRequest(requestId, reviewerId, chamaId),
            ).rejects.toThrow(ConflictException);

            await expect(
              service.approveJoinRequest(requestId, reviewerId, chamaId),
            ).rejects.toThrow('Only pending requests can be approved');
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should reject rejection of non-PENDING requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.uuid(), // reviewerId
          fc.uuid(), // requestId
          fc.constantFrom(
            join_request_status.APPROVED,
            join_request_status.REJECTED,
          ), // non-PENDING status
          async (userId, chamaId, reviewerId, requestId, status) => {
            // Setup: Reviewer is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: reviewerId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock non-PENDING request
            const mockRequest = {
              id: requestId,
              chama_id: chamaId,
              user_id: userId,
              status: status,
              message: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: fc.sample(fc.uuid(), 1)[0],
              reviewed_at: new Date(),
            };

            mockPrismaService.join_request.findUnique.mockResolvedValue(
              mockRequest,
            );

            // Execute & Verify: Attempt to reject should throw ConflictException
            await expect(
              service.rejectJoinRequest(requestId, reviewerId, chamaId),
            ).rejects.toThrow(ConflictException);

            await expect(
              service.rejectJoinRequest(requestId, reviewerId, chamaId),
            ).rejects.toThrow('Only pending requests can be rejected');
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 10: Duplicate Membership Prevention', () => {
    /**
     * **Validates: Requirements 3.6**
     *
     * Property: For any join request approval, if the user is already a member
     * of the chama, the approval should be rejected with an error.
     */
    it('should reject approval if user is already a member', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.uuid(), // reviewerId
          fc.uuid(), // requestId
          async (userId, chamaId, reviewerId, requestId) => {
            // Setup: Reviewer is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: reviewerId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock transaction with existing membership
            const mockRequest = {
              id: requestId,
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
            };

            const existingUserMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              role: user_role.MEMBER,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            mockPrismaService.$transaction.mockImplementation(
              async callback => {
                const tx = {
                  join_request: {
                    findUnique: jest.fn().mockResolvedValue(mockRequest),
                  },
                  membership: {
                    findFirst: jest
                      .fn()
                      .mockResolvedValue(existingUserMembership),
                  },
                };
                return callback(tx);
              },
            );

            // Execute & Verify: Attempt to approve should throw ConflictException
            await expect(
              service.approveJoinRequest(requestId, reviewerId, chamaId),
            ).rejects.toThrow(ConflictException);

            await expect(
              service.approveJoinRequest(requestId, reviewerId, chamaId),
            ).rejects.toThrow('User is already a member of this chama');
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('approveJoinRequest edge cases', () => {
    /**
     * **Validates: Requirements 3.5**
     *
     * Test approving already approved request fails
     */
    it('should throw ConflictException when approving already approved request', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';
      const reviewerId = 'reviewer-789';
      const requestId = 'request-abc';

      // Setup: Reviewer is a chairperson
      const mockMembership = {
        id: 'membership-xyz',
        chama_id: chamaId,
        user_id: reviewerId,
        role: user_role.CHAIRPERSON,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.membership.findFirst.mockResolvedValue(mockMembership);

      // Setup: Request is already approved
      const mockRequest = {
        id: requestId,
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.APPROVED,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: 'previous-reviewer',
        reviewed_at: new Date(),
      };

      mockPrismaService.$transaction.mockImplementation(async callback => {
        const tx = {
          join_request: {
            findUnique: jest.fn().mockResolvedValue(mockRequest),
          },
        };
        return callback(tx);
      });

      // Execute & Verify
      await expect(
        service.approveJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.approveJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow('Only pending requests can be approved');
    });

    /**
     * **Validates: Requirements 3.5**
     *
     * Test approving rejected request fails
     */
    it('should throw ConflictException when approving rejected request', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';
      const reviewerId = 'reviewer-789';
      const requestId = 'request-abc';

      // Setup: Reviewer is a chairperson
      const mockMembership = {
        id: 'membership-xyz',
        chama_id: chamaId,
        user_id: reviewerId,
        role: user_role.CHAIRPERSON,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.membership.findFirst.mockResolvedValue(mockMembership);

      // Setup: Request is rejected
      const mockRequest = {
        id: requestId,
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.REJECTED,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: 'previous-reviewer',
        reviewed_at: new Date(),
      };

      mockPrismaService.$transaction.mockImplementation(async callback => {
        const tx = {
          join_request: {
            findUnique: jest.fn().mockResolvedValue(mockRequest),
          },
        };
        return callback(tx);
      });

      // Execute & Verify
      await expect(
        service.approveJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.approveJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow('Only pending requests can be approved');
    });

    /**
     * **Validates: Requirements 3.5**
     *
     * Test transaction rollback on membership creation failure
     */
    it('should rollback transaction if membership creation fails', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';
      const reviewerId = 'reviewer-789';
      const requestId = 'request-abc';

      // Setup: Reviewer is a chairperson
      const mockMembership = {
        id: 'membership-xyz',
        chama_id: chamaId,
        user_id: reviewerId,
        role: user_role.CHAIRPERSON,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.membership.findFirst.mockResolvedValue(mockMembership);

      // Setup: Mock transaction that fails on membership creation
      const mockRequest = {
        id: requestId,
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.PENDING,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: null,
        reviewed_at: null,
      };

      mockPrismaService.$transaction.mockImplementation(async callback => {
        const tx = {
          join_request: {
            findUnique: jest.fn().mockResolvedValue(mockRequest),
            update: jest.fn().mockResolvedValue({
              ...mockRequest,
              status: join_request_status.APPROVED,
            }),
          },
          membership: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest
              .fn()
              .mockRejectedValue(new Error('Database constraint violation')),
          },
        };
        return callback(tx);
      });

      // Execute & Verify: Should throw error and transaction should rollback
      await expect(
        service.approveJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow();
    });
  });

  describe('Feature: chama-member-join-requests, Property 11: Rejection State Transition', () => {
    /**
     * **Validates: Requirements 4.1, 4.2, 4.3**
     *
     * Property: For any PENDING join request, when a chairperson rejects it,
     * the request status should change to REJECTED, the reviewer ID and review
     * timestamp should be recorded, and no membership should be created.
     */
    it('should transition to REJECTED and record audit trail without creating membership', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.uuid(), // reviewerId
          fc.uuid(), // requestId
          async (userId, chamaId, reviewerId, requestId) => {
            // Setup: Reviewer is a chairperson
            const mockMembership = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: reviewerId,
              role: user_role.CHAIRPERSON,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPrismaService.membership.findFirst.mockResolvedValue(
              mockMembership,
            );

            // Setup: Mock PENDING request
            const mockRequest = {
              id: requestId,
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
            };

            const mockUpdatedRequest = {
              ...mockRequest,
              status: join_request_status.REJECTED,
              reviewed_by: reviewerId,
              reviewed_at: new Date(),
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };

            mockPrismaService.join_request.findUnique.mockResolvedValue(
              mockRequest,
            );
            mockPrismaService.join_request.update.mockResolvedValue(
              mockUpdatedRequest,
            );

            // Execute: Reject request
            const result = await service.rejectJoinRequest(
              requestId,
              reviewerId,
              chamaId,
            );

            // Verify: Status changed to REJECTED
            expect(result.status).toBe(join_request_status.REJECTED);

            // Verify: Reviewer and timestamp recorded
            expect(result.reviewed_by).toBe(reviewerId);
            expect(result.reviewed_at).toBeDefined();
            expect(result.reviewed_at).toBeInstanceOf(Date);

            // Verify: Chairperson verification was performed
            expect(mockPrismaService.membership.findFirst).toHaveBeenCalledWith(
              {
                where: {
                  chama_id: chamaId,
                  user_id: reviewerId,
                },
              },
            );

            // Verify: Request was found
            expect(
              mockPrismaService.join_request.findUnique,
            ).toHaveBeenCalledWith({
              where: { id: requestId },
            });

            // Verify: Request was updated
            expect(mockPrismaService.join_request.update).toHaveBeenCalledWith(
              expect.objectContaining({
                where: { id: requestId },
                data: expect.objectContaining({
                  status: join_request_status.REJECTED,
                  reviewed_by: reviewerId,
                }),
              }),
            );

            // Verify: No membership was created (create should not be called)
            expect(mockPrismaService.membership.create).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('rejectJoinRequest edge cases', () => {
    /**
     * **Validates: Requirements 4.5**
     *
     * Test rejecting already rejected request fails
     */
    it('should throw ConflictException when rejecting already rejected request', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';
      const reviewerId = 'reviewer-789';
      const requestId = 'request-abc';

      // Setup: Reviewer is a chairperson
      const mockMembership = {
        id: 'membership-xyz',
        chama_id: chamaId,
        user_id: reviewerId,
        role: user_role.CHAIRPERSON,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.membership.findFirst.mockResolvedValue(mockMembership);

      // Setup: Request is already rejected
      const mockRequest = {
        id: requestId,
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.REJECTED,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: 'previous-reviewer',
        reviewed_at: new Date(),
      };

      mockPrismaService.join_request.findUnique.mockResolvedValue(mockRequest);

      // Execute & Verify
      await expect(
        service.rejectJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.rejectJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow('Only pending requests can be rejected');
    });

    /**
     * **Validates: Requirements 4.5**
     *
     * Test rejecting approved request fails
     */
    it('should throw ConflictException when rejecting approved request', async () => {
      const userId = 'user-123';
      const chamaId = 'chama-456';
      const reviewerId = 'reviewer-789';
      const requestId = 'request-abc';

      // Setup: Reviewer is a chairperson
      const mockMembership = {
        id: 'membership-xyz',
        chama_id: chamaId,
        user_id: reviewerId,
        role: user_role.CHAIRPERSON,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.membership.findFirst.mockResolvedValue(mockMembership);

      // Setup: Request is approved
      const mockRequest = {
        id: requestId,
        chama_id: chamaId,
        user_id: userId,
        status: join_request_status.APPROVED,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewed_by: 'previous-reviewer',
        reviewed_at: new Date(),
      };

      mockPrismaService.join_request.findUnique.mockResolvedValue(mockRequest);

      // Execute & Verify
      await expect(
        service.rejectJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.rejectJoinRequest(requestId, reviewerId, chamaId),
      ).rejects.toThrow('Only pending requests can be rejected');
    });
  });

  describe('Feature: chama-member-join-requests, Property 12: User Request Filtering', () => {
    /**
     * **Validates: Requirements 5.1, 7.3**
     *
     * Property: For any authenticated user requesting their own join requests,
     * the system should return only requests where the userId matches the
     * authenticated user's ID.
     */
    it('should return only requests belonging to the authenticated user', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // authenticatedUserId
          fc.array(
            fc.record({
              chamaId: fc.uuid(),
              status: fc.constantFrom(
                join_request_status.PENDING,
                join_request_status.APPROVED,
                join_request_status.REJECTED,
              ),
            }),
            { minLength: 1, maxLength: 10 },
          ),
          async (authenticatedUserId, requests) => {
            // Setup: Mock user's requests
            const mockRequests = requests.map((req, index) => ({
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: req.chamaId,
              user_id: authenticatedUserId,
              status: req.status,
              message: null,
              createdAt: new Date(Date.now() - index * 60000),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              chama: {
                id: req.chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            }));

            mockPrismaService.join_request.findMany.mockResolvedValue(
              mockRequests,
            );

            // Execute: Get user's join requests
            const result =
              await service.getUserJoinRequests(authenticatedUserId);

            // Verify: All returned requests belong to the authenticated user
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            result.forEach((request: any) => {
              expect(request.user_id).toBe(authenticatedUserId);
            });

            // Verify: Query was executed with correct filter
            expect(
              mockPrismaService.join_request.findMany,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                where: {
                  user_id: authenticatedUserId,
                },
              }),
            );

            // Verify: Results are ordered by createdAt descending
            expect(
              mockPrismaService.join_request.findMany,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                orderBy: {
                  createdAt: 'desc',
                },
              }),
            );

            // Verify: Chama information is included
            expect(
              mockPrismaService.join_request.findMany,
            ).toHaveBeenCalledWith(
              expect.objectContaining({
                include: expect.objectContaining({
                  chama: expect.any(Object),
                }),
              }),
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('getUserJoinRequests edge cases', () => {
    /**
     * **Validates: Requirements 5.5**
     *
     * Test user with no requests returns empty array
     */
    it('should return empty array when user has no join requests', async () => {
      const userId = 'user-123';

      // Setup: No requests for user
      mockPrismaService.join_request.findMany.mockResolvedValue([]);

      // Execute: Get user's join requests
      const result = await service.getUserJoinRequests(userId);

      // Verify: Empty array is returned
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);

      // Verify: Query was executed
      expect(mockPrismaService.join_request.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            user_id: userId,
          },
        }),
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 14: Referential Integrity Validation', () => {
    /**
     * **Validates: Requirements 6.2, 6.3**
     *
     * Property: For any join request creation, the system should validate that both
     * the chama and user exist in the database, and reject requests with non-existent
     * IDs with an appropriate error.
     */
    it('should reject join request for non-existent chama', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          async (userId, chamaId) => {
            // Setup: Chama does not exist
            mockPrismaService.chama.findUnique.mockResolvedValue(null);

            // Test: Attempt to create join request
            await expect(
              service.createJoinRequest(userId, {
                chamaId,
                message: undefined,
              }),
            ).rejects.toThrow(NotFoundException);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should validate chama exists before creating join request', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.option(fc.string({ maxLength: 500 }), { nil: undefined }), // message
          async (userId, chamaId, message) => {
            // Setup: Mock chama exists
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);
            mockPrismaService.membership.findFirst.mockResolvedValue(null);
            mockPrismaService.join_request.findFirst.mockResolvedValue(null);

            const mockCreatedRequest = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: message,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };
            mockPrismaService.join_request.create.mockResolvedValue(
              mockCreatedRequest,
            );

            // Test: Create join request
            const result = await service.createJoinRequest(userId, {
              chamaId,
              message,
            });

            // Verify: Chama existence was checked
            expect(mockPrismaService.chama.findUnique).toHaveBeenCalledWith({
              where: { id: chamaId },
            });
            expect(result).toBeDefined();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 15: UUID Format Validation', () => {
    /**
     * **Validates: Requirements 6.5**
     *
     * Property: For any join request created by the system, the ID should be
     * a valid UUID format.
     */
    it('should create join requests with valid UUID format', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          async (userId, chamaId) => {
            // Setup: Mock successful creation
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);
            mockPrismaService.membership.findFirst.mockResolvedValue(null);
            mockPrismaService.join_request.findFirst.mockResolvedValue(null);

            const generatedId = fc.sample(fc.uuid(), 1)[0];
            const mockCreatedRequest = {
              id: generatedId,
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };
            mockPrismaService.join_request.create.mockResolvedValue(
              mockCreatedRequest,
            );

            // Test: Create join request
            const result = await service.createJoinRequest(userId, {
              chamaId,
              message: undefined,
            });

            // Verify: ID is a valid UUID format
            const uuidRegex =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            expect(result.id).toMatch(uuidRegex);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 5: Response Completeness', () => {
    /**
     * **Validates: Requirements 2.2, 5.2, 8.5**
     *
     * Property: For any join request returned by the API, the response should include
     * all required fields: id, chamaId, userId, status, message (if present), timestamps,
     * and related user/chama information as specified in the endpoint.
     */
    it('should return join requests with all required fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          fc.option(fc.string({ maxLength: 500 }), { nil: undefined }), // message
          async (userId, chamaId, message) => {
            // Setup: Mock successful creation
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);
            mockPrismaService.membership.findFirst.mockResolvedValue(null);
            mockPrismaService.join_request.findFirst.mockResolvedValue(null);

            const mockCreatedRequest = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: message,
              createdAt: new Date(),
              updatedAt: new Date(),
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };
            mockPrismaService.join_request.create.mockResolvedValue(
              mockCreatedRequest,
            );

            // Test: Create join request
            const result = await service.createJoinRequest(userId, {
              chamaId,
              message,
            });

            // Verify: All required fields are present
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('chama_id');
            expect(result).toHaveProperty('user_id');
            expect(result).toHaveProperty('status');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
            expect(result).toHaveProperty('user_join_request_user_idTouser');
            expect(result).toHaveProperty('chama');

            // Verify: Values are correct
            expect(result.id).toBeDefined();
            expect(result.chama_id).toBe(chamaId);
            expect(result.user_id).toBe(userId);
            expect(result.status).toBe(join_request_status.PENDING);
            expect(result.message).toBe(message);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Feature: chama-member-join-requests, Property 17: Timestamp Format', () => {
    /**
     * **Validates: Requirements 8.4**
     *
     * Property: For any join request returned by the API, all timestamp fields
     * (createdAt, updatedAt, reviewedAt) should be in ISO 8601 format.
     */
    it('should return timestamps in ISO 8601 format', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), // userId
          fc.uuid(), // chamaId
          async (userId, chamaId) => {
            // Setup: Mock successful creation
            const mockChama = {
              id: chamaId,
              name: 'Test Chama',
              description: 'Test Description',
              rules: null,
              created_by: userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              country: 'KENYA',
              members_count: 1,
              organization_role: null,
            };
            mockPrismaService.chama.findUnique.mockResolvedValue(mockChama);
            mockPrismaService.membership.findFirst.mockResolvedValue(null);
            mockPrismaService.join_request.findFirst.mockResolvedValue(null);

            const now = new Date();
            const mockCreatedRequest = {
              id: fc.sample(fc.uuid(), 1)[0],
              chama_id: chamaId,
              user_id: userId,
              status: join_request_status.PENDING,
              message: null,
              createdAt: now,
              updatedAt: now,
              reviewed_by: null,
              reviewed_at: null,
              user_join_request_user_idTouser: {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
              },
              chama: {
                id: chamaId,
                name: 'Test Chama',
                description: 'Test Description',
              },
            };
            mockPrismaService.join_request.create.mockResolvedValue(
              mockCreatedRequest,
            );

            // Test: Create join request
            const result = await service.createJoinRequest(userId, {
              chamaId,
              message: undefined,
            });

            // Verify: Timestamps are Date objects (which can be serialized to ISO 8601)
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);

            // Verify: Timestamps can be converted to ISO 8601 format
            const createdAtISO = result.createdAt.toISOString();
            const updatedAtISO = result.updatedAt.toISOString();

            // ISO 8601 format regex
            const iso8601Regex =
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
            expect(createdAtISO).toMatch(iso8601Regex);
            expect(updatedAtISO).toMatch(iso8601Regex);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
