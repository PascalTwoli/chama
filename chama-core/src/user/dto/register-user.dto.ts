import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The user's first name" })
  firstName: string;


  @IsOptional()
  @IsString()
  @ApiProperty({ description: "The user's last name" })
  lastName?: string;
 
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: "The user's email address" })
  email: string;

  @IsOptional()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +254712345678). It must start with + followed by country code and number.'
  })
  @ApiProperty({ description: "The user's phone number" })
  phoneNumber?: string;
  
  @ApiProperty({ description: "The user's password" })
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}