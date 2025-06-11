export interface CurrentUser {
    id: string;
    firebaseUid: string;
    email?: string;
    displayName?: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
