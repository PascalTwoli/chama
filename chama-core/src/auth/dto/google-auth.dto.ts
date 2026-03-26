import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for Google authentication token verification
 * Used to link Google credentials with existing password accounts
 */
export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string; // Firebase ID token from Google sign-in
}

/**
 * DTO for account linking verification
 */
export class LinkAccountDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string; // Password for existing account

  @IsString()
  @IsNotEmpty()
  googleIdToken: string; // ID token from Google sign-in attempt
}
