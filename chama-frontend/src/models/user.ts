import { UserType } from "../data/user-role";

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	role: UserType
};

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignInResponse {
    token: string;
    refreshToken: string; 
    user: User
}


//Signup request interfaces
export interface SignupRequest {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
}

//Signup response interfaces
export interface SignupResponse {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	message?: string;
	token?: string;
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


// API error response interface
export interface ApiErrorResponse {
	message: string | string[];
	statusCode?: number;
	error?: string;
	errors?: Array<{ message: string; field?: string }>;  //handle structured validation errors
}



