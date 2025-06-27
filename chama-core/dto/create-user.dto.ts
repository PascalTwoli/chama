import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsEnum } from 'class-validator';

export enum UserRole {
  CHAIRPERSON = 'chairperson',
  MEMBER = 'member',
  TREASURER = 'treasurer',
  SECRETARY = 'secretary'
}

export class CreateUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Expose({ name: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
  })
  password!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format'
  })
  phone!: string;

  @Expose()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
