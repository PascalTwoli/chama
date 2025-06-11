export declare abstract class Entity<T = any> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<T>);
}
