import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignMemberRoleDto {
  @ApiProperty({ description: 'The role ID to assign to the member' })
  @IsString()
  roleId: string;

  @ApiProperty({ description: 'The chama ID' })
  @IsString()
  chamaId: string;
}
