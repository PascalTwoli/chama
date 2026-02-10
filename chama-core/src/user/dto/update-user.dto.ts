import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'First name of the user' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    required: false,
    description: 'Display name (full name) of the user',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ required: false, description: 'Email address of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, description: 'Phone number of the user' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'Phone number of the user (alternative field)',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    description: 'Password for the user account',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    required: false,
    enum: UserType,
    description: 'User type (ADMIN or MEMBER)',
  })
  @IsEnum(UserType)
  @IsOptional()
  activeUserType?: UserType;
}
