import {
  IsEnum,
  isEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Countries, UserRole } from '@prisma/client';

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
  @IsEnum(UserRole)
  organizationRole?: UserRole;

  @IsOptional()
  @IsNumber()
  membersCount?: number; // Assuming this is a number representing the count of members

  @IsOptional()
  @IsEnum(Countries)
  country?: Countries;

  @IsString()
  @IsNotEmpty()
  rules!: string; // Assuming this is a string representing the rules of the chama
}
