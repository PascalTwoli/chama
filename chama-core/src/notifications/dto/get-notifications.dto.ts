import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationStatus {
  ALL = 'all',
  UNREAD = 'unread',
  ACTION = 'action',
}

export enum NotificationAudience {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class GetNotificationsDto {
  @ApiProperty({ description: 'Chama ID', required: true })
  @IsString()
  chamaId: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: NotificationStatus, default: NotificationStatus.ALL })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus = NotificationStatus.ALL;

  @ApiPropertyOptional({ enum: NotificationAudience })
  @IsOptional()
  @IsEnum(NotificationAudience)
  audience?: NotificationAudience;
}
