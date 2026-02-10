/**
 * Centralized exports for all Prisma models and types
 *
 * This file provides a single entry point for importing Prisma-generated
 * types throughout the application, ensuring consistency and easier maintenance.
 */

// Re-export all Prisma models
export type {
  User,
  Chama,
  Membership,
  Invite,
  Contribution,
  Payment,
  NotificationType,
  Notification,
  UiSettings,
  Transaction,
} from '../../../../../generated/prisma';

// Re-export all Prisma enums
export {
  UserRole,
  ContributionStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryMethod,
  TransactionType,
  TransactionStatus,
  UserType,
} from '../../../../../generated/prisma';

// Import and re-export Prisma namespace for advanced types
import { Prisma as _Prisma } from '../../../../../generated/prisma';
export { _Prisma as Prisma };

// Helper types for common patterns
export type UserWithMemberships = _Prisma.UserGetPayload<{
  include: { memberships: true };
}>;

export type ChamaWithMembers = _Prisma.ChamaGetPayload<{
  include: {
    memberships: {
      include: { user: true };
    };
  };
}>;

export type ContributionWithPayments = _Prisma.ContributionGetPayload<{
  include: { payments: true };
}>;

export type TransactionWithDetails = _Prisma.TransactionGetPayload<{
  include: {
    user: true;
    chama: true;
  };
}>;

// Create types for input validation
export type CreateUserInput = _Prisma.UserCreateInput;
export type UpdateUserInput = _Prisma.UserUpdateInput;
export type CreateChamaInput = _Prisma.ChamaCreateInput;
export type UpdateChamaInput = _Prisma.ChamaUpdateInput;
export type CreateContributionInput = _Prisma.ContributionCreateInput;
export type UpdateContributionInput = _Prisma.ContributionUpdateInput;
export type CreateTransactionInput = _Prisma.TransactionCreateInput;
export type UpdateTransactionInput = _Prisma.TransactionUpdateInput;

// Filter types for queries
export type UserWhereInput = _Prisma.UserWhereInput;
export type ChamaWhereInput = _Prisma.ChamaWhereInput;
export type ContributionWhereInput = _Prisma.ContributionWhereInput;
export type TransactionWhereInput = _Prisma.TransactionWhereInput;

// Order by types
export type UserOrderByInput = _Prisma.UserOrderByWithRelationInput;
export type ChamaOrderByInput = _Prisma.ChamaOrderByWithRelationInput;
export type ContributionOrderByInput =
  _Prisma.ContributionOrderByWithRelationInput;
export type TransactionOrderByInput =
  _Prisma.TransactionOrderByWithRelationInput;
