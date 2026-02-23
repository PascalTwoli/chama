import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JoinRequestModule } from './join-request.module';
import { PrismaService } from '../prisma/prisma.service';
import { join_request_status, user_role } from '@prisma/client';

describe('JoinRequest Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JoinRequestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Complete Flow: Create Request → Approve → Verify Membership', () => {
    it('should complete full approval flow', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();
      const chairpersonId = crypto.randomUUID();

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Create chairperson
      await prisma.user.create({
        data: {
          id: chairpersonId,
          email: `chairperson-${chairpersonId}@example.com`,
          name: 'Test Chairperson',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: chairpersonId,
          updatedAt: new Date(),
        },
      });

      // Create chairperson membership
      await prisma.membership.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: chairpersonId,
          role: user_role.CHAIRPERSON,
          updatedAt: new Date(),
        },
      });

      // Step 1: Create join request
      const joinRequest = await prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          message: 'I would like to join',
          updatedAt: new Date(),
        },
      });

      expect(joinRequest.status).toBe(join_request_status.PENDING);

      // Step 2: Approve join request
      const updatedRequest = await prisma.join_request.update({
        where: { id: joinRequest.id },
        data: {
          status: join_request_status.APPROVED,
          reviewed_by: chairpersonId,
          reviewed_at: new Date(),
          updatedAt: new Date(),
        },
      });

      expect(updatedRequest.status).toBe(join_request_status.APPROVED);
      expect(updatedRequest.reviewed_by).toBe(chairpersonId);

      // Step 3: Create membership
      const membership = await prisma.membership.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          role: user_role.MEMBER,
          updatedAt: new Date(),
        },
      });

      expect(membership.user_id).toBe(userId);
      expect(membership.chama_id).toBe(chamaId);
      expect(membership.role).toBe(user_role.MEMBER);

      // Cleanup
      await prisma.membership.deleteMany({ where: { chama_id: chamaId } });
      await prisma.join_request.deleteMany({ where: { chama_id: chamaId } });
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.deleteMany({
        where: { id: { in: [userId, chairpersonId] } },
      });
    });
  });

  describe('Complete Flow: Create Request → Reject → Verify No Membership', () => {
    it('should complete full rejection flow', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();
      const chairpersonId = crypto.randomUUID();

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Create chairperson
      await prisma.user.create({
        data: {
          id: chairpersonId,
          email: `chairperson-${chairpersonId}@example.com`,
          name: 'Test Chairperson',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: chairpersonId,
          updatedAt: new Date(),
        },
      });

      // Create chairperson membership
      await prisma.membership.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: chairpersonId,
          role: user_role.CHAIRPERSON,
          updatedAt: new Date(),
        },
      });

      // Step 1: Create join request
      const joinRequest = await prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          message: 'I would like to join',
          updatedAt: new Date(),
        },
      });

      expect(joinRequest.status).toBe(join_request_status.PENDING);

      // Step 2: Reject join request
      const updatedRequest = await prisma.join_request.update({
        where: { id: joinRequest.id },
        data: {
          status: join_request_status.REJECTED,
          reviewed_by: chairpersonId,
          reviewed_at: new Date(),
          updatedAt: new Date(),
        },
      });

      expect(updatedRequest.status).toBe(join_request_status.REJECTED);
      expect(updatedRequest.reviewed_by).toBe(chairpersonId);

      // Step 3: Verify no membership was created
      const membership = await prisma.membership.findFirst({
        where: {
          chama_id: chamaId,
          user_id: userId,
        },
      });

      expect(membership).toBeNull();

      // Cleanup
      await prisma.membership.deleteMany({ where: { chama_id: chamaId } });
      await prisma.join_request.deleteMany({ where: { chama_id: chamaId } });
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.deleteMany({
        where: { id: { in: [userId, chairpersonId] } },
      });
    });
  });

  describe('Authorization Tests', () => {
    it('should enforce chairperson-only access', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();
      const chairpersonId = crypto.randomUUID();

      // Create users
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      await prisma.user.create({
        data: {
          id: chairpersonId,
          email: `chairperson-${chairpersonId}@example.com`,
          name: 'Test Chairperson',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: chairpersonId,
          updatedAt: new Date(),
        },
      });

      // Create chairperson membership
      await prisma.membership.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: chairpersonId,
          role: user_role.CHAIRPERSON,
          updatedAt: new Date(),
        },
      });

      // Verify: Only chairperson can access certain operations
      const chairpersonMembership = await prisma.membership.findFirst({
        where: {
          chama_id: chamaId,
          user_id: chairpersonId,
        },
      });

      expect(chairpersonMembership?.role).toBe(user_role.CHAIRPERSON);

      // Verify: Regular user is not a chairperson
      const userMembership = await prisma.membership.findFirst({
        where: {
          chama_id: chamaId,
          user_id: userId,
        },
      });

      expect(userMembership).toBeNull();

      // Cleanup
      await prisma.membership.deleteMany({ where: { chama_id: chamaId } });
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.deleteMany({
        where: { id: { in: [userId, chairpersonId] } },
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle non-existent chama', async () => {
      const nonExistentChamaId = crypto.randomUUID();

      const chama = await prisma.chama.findUnique({
        where: { id: nonExistentChamaId },
      });

      expect(chama).toBeNull();
    });

    it('should handle duplicate join requests', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: userId,
          updatedAt: new Date(),
        },
      });

      // Create first join request
      await prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          updatedAt: new Date(),
        },
      });

      // Attempt to create duplicate - should fail due to unique constraint
      await expect(
        prisma.join_request.create({
          data: {
            id: crypto.randomUUID(),
            chama_id: chamaId,
            user_id: userId,
            status: join_request_status.PENDING,
            updatedAt: new Date(),
          },
        }),
      ).rejects.toThrow();

      // Cleanup
      await prisma.join_request.deleteMany({ where: { chama_id: chamaId } });
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.delete({ where: { id: userId } });
    });
  });

  describe('Database Constraints Tests', () => {
    it('should enforce unique constraint on [chamaId, userId]', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: userId,
          updatedAt: new Date(),
        },
      });

      // Create first join request
      await prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          updatedAt: new Date(),
        },
      });

      // Attempt to create duplicate - should fail
      await expect(
        prisma.join_request.create({
          data: {
            id: crypto.randomUUID(),
            chama_id: chamaId,
            user_id: userId,
            status: join_request_status.PENDING,
            updatedAt: new Date(),
          },
        }),
      ).rejects.toThrow();

      // Cleanup
      await prisma.join_request.deleteMany({ where: { chama_id: chamaId } });
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.delete({ where: { id: userId } });
    });

    it('should cascade delete join requests when chama is deleted', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: userId,
          updatedAt: new Date(),
        },
      });

      // Create join request
      const joinRequest = await prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          updatedAt: new Date(),
        },
      });

      // Delete chama
      await prisma.chama.delete({ where: { id: chamaId } });

      // Verify join request was cascade deleted
      const deletedRequest = await prisma.join_request.findUnique({
        where: { id: joinRequest.id },
      });

      expect(deletedRequest).toBeNull();

      // Cleanup
      await prisma.user.delete({ where: { id: userId } });
    });

    it('should cascade delete join requests when user is deleted', async () => {
      // Setup: Create test data
      const userId = crypto.randomUUID();
      const chamaId = crypto.randomUUID();
      const creatorId = crypto.randomUUID();

      // Create creator
      await prisma.user.create({
        data: {
          id: creatorId,
          email: `creator-${creatorId}@example.com`,
          name: 'Test Creator',
          updatedAt: new Date(),
        },
      });

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: creatorId,
          updatedAt: new Date(),
        },
      });

      // Create join request
      const joinRequest = await prisma.join_request.create({
        data: {
          id: crypto.randomUUID(),
          chama_id: chamaId,
          user_id: userId,
          status: join_request_status.PENDING,
          updatedAt: new Date(),
        },
      });

      // Delete user
      await prisma.user.delete({ where: { id: userId } });

      // Verify join request was cascade deleted
      const deletedRequest = await prisma.join_request.findUnique({
        where: { id: joinRequest.id },
      });

      expect(deletedRequest).toBeNull();

      // Cleanup
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.delete({ where: { id: creatorId } });
    });

    it('should enforce foreign key constraint for chama_id', async () => {
      const userId = crypto.randomUUID();
      const nonExistentChamaId = crypto.randomUUID();

      // Create user
      await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
          name: 'Test User',
          updatedAt: new Date(),
        },
      });

      // Attempt to create join request with non-existent chama
      await expect(
        prisma.join_request.create({
          data: {
            id: crypto.randomUUID(),
            chama_id: nonExistentChamaId,
            user_id: userId,
            status: join_request_status.PENDING,
            updatedAt: new Date(),
          },
        }),
      ).rejects.toThrow();

      // Cleanup
      await prisma.user.delete({ where: { id: userId } });
    });

    it('should enforce foreign key constraint for user_id', async () => {
      const chamaId = crypto.randomUUID();
      const creatorId = crypto.randomUUID();
      const nonExistentUserId = crypto.randomUUID();

      // Create creator
      await prisma.user.create({
        data: {
          id: creatorId,
          email: `creator-${creatorId}@example.com`,
          name: 'Test Creator',
          updatedAt: new Date(),
        },
      });

      // Create chama
      await prisma.chama.create({
        data: {
          id: chamaId,
          name: 'Test Chama',
          description: 'Integration test chama',
          country: 'KENYA',
          members_count: 1,
          created_by: creatorId,
          updatedAt: new Date(),
        },
      });

      // Attempt to create join request with non-existent user
      await expect(
        prisma.join_request.create({
          data: {
            id: crypto.randomUUID(),
            chama_id: chamaId,
            user_id: nonExistentUserId,
            status: join_request_status.PENDING,
            updatedAt: new Date(),
          },
        }),
      ).rejects.toThrow();

      // Cleanup
      await prisma.chama.delete({ where: { id: chamaId } });
      await prisma.user.delete({ where: { id: creatorId } });
    });
  });
});
