import { UserRole } from '@prisma/client';
import { UserEntity } from '../../user/entities/user.entity';
import { ChamaEntity } from './invite.entity';
export declare class MembershipEntity {
    id: string;
    userId: string;
    user?: UserEntity;
    chamaId: string;
    chama?: ChamaEntity;
    role: UserRole;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<MembershipEntity>);
}
