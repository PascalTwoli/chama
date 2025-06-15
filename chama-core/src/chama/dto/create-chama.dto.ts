import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}

