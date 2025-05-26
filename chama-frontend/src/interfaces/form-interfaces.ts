export interface SignInFormData {
    email: string;
    password: string;
}

export interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
}

// Interface for form errors
export interface FormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	password?: string;
	[key: string]: string | undefined;
}