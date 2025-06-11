import { Entity } from './base.entity';
import { User, UserRole, UserType } from '../models';
export declare class UserEntity extends Entity<UserEntity> implements User {
    name: string | null;
    email: string | null;
    phone: string | null;
    passwordHash: string | null;
    role: UserRole;
    activeUserType: UserType | null;
    constructor(partial: Partial<UserEntity>);
}
