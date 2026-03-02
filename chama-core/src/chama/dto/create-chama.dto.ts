import {
  IsEnum,
  isEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { country, user_role } from '@prisma/client';

export class CreateChamaDto {
  @ApiProperty({
    description: 'The name of the chama',
    example: 'Wealth Builders',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Description of the chama',
    example: 'A group of friends saving together for future investments',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsEnum(user_role)
  organizationRole?: user_role;

  @IsOptional()
  @IsNumber()
  membersCount?: number; // Assuming this is a number representing the count of members

  @IsOptional()
  @IsEnum(country)
  country?: country;

  @IsString()
  @IsNotEmpty()
  rules!: string; // Assuming this is a string representing the rules of the chama
}
