export declare class ChamaEntity {
    id: string;
    name: string;
    description?: string;
    constructor(partial: Partial<ChamaEntity>);
}
export declare class InviteEntity {
    id: string;
    chamaId: string;
    chama?: ChamaEntity;
    token: string;
    sentToEmail: string;
    expiresAt: Date;
    usedAt?: Date | null;
    createdAt: Date;
    constructor(partial: Partial<InviteEntity>);
}
