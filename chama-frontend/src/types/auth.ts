export type UserRole = "admin" | "member"

export type UserProfile = {
    id: string
    firstName: string
    lastName: string
    email: string;
    phoneNumber: string;
    role: UserRole
}