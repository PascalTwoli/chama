export type { User, Chama, Membership, Invite, Contribution, Payment, NotificationType, Notification, UiSettings, Transaction, } from '../../../../../generated/prisma';
export { UserRole, ContributionStatus, PaymentMethod, PaymentStatus, DeliveryMethod, TransactionType, TransactionStatus, UserType, } from '../../../../../generated/prisma';
import { Prisma as _Prisma } from '../../../../../generated/prisma';
export { _Prisma as Prisma };
export type UserWithMemberships = _Prisma.UserGetPayload<{
    include: {
        memberships: true;
    };
}>;
export type ChamaWithMembers = _Prisma.ChamaGetPayload<{
    include: {
        memberships: {
            include: {
                user: true;
            };
        };
    };
}>;
export type ContributionWithPayments = _Prisma.ContributionGetPayload<{
    include: {
        payments: true;
    };
}>;
export type TransactionWithDetails = _Prisma.TransactionGetPayload<{
    include: {
        user: true;
        chama: true;
    };
}>;
export type CreateUserInput = _Prisma.UserCreateInput;
export type UpdateUserInput = _Prisma.UserUpdateInput;
export type CreateChamaInput = _Prisma.ChamaCreateInput;
export type UpdateChamaInput = _Prisma.ChamaUpdateInput;
export type CreateContributionInput = _Prisma.ContributionCreateInput;
export type UpdateContributionInput = _Prisma.ContributionUpdateInput;
export type CreateTransactionInput = _Prisma.TransactionCreateInput;
export type UpdateTransactionInput = _Prisma.TransactionUpdateInput;
export type UserWhereInput = _Prisma.UserWhereInput;
export type ChamaWhereInput = _Prisma.ChamaWhereInput;
export type ContributionWhereInput = _Prisma.ContributionWhereInput;
export type TransactionWhereInput = _Prisma.TransactionWhereInput;
export type UserOrderByInput = _Prisma.UserOrderByWithRelationInput;
export type ChamaOrderByInput = _Prisma.ChamaOrderByWithRelationInput;
export type ContributionOrderByInput = _Prisma.ContributionOrderByWithRelationInput;
export type TransactionOrderByInput = _Prisma.TransactionOrderByWithRelationInput;
