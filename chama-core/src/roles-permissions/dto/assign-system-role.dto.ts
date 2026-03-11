import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { system_role } from '@prisma/client';

export class AssignSystemRoleDto {
  @ApiProperty({
    description: 'System role to assign',
    enum: ['ADMIN', 'NONE'],
  })
  @IsEnum(system_role)
  systemRole: system_role;

  @ApiProperty({ description: 'The chama ID (for ownership verification)' })
  @IsString()
  chamaId: string;
}
