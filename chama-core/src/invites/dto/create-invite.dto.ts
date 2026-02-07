import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({
    description: 'The UUID of the chama to invite the user to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  chamaId!: string;

  @ApiProperty({
    description: 'The email address of the user to invite',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class AcceptInviteDto {
  @ApiProperty({
    description: 'The token to accept',
    example: 'abcdef123456',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
