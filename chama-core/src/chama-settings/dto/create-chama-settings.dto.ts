import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { ContributionModel, ContributionFrequency } from '@prisma/client';

export class CreateChamaSettingsDto {
  @ApiProperty({
    description: 'Contribution model type',
    enum: ContributionModel,
    example: ContributionModel.FIXED,
  })
  @IsNotEmpty({ message: 'Contribution model is required' })
  @IsEnum(ContributionModel, { message: 'Invalid contribution model' })
  contributionModel!: ContributionModel;

  @ApiProperty({
    description: 'Fixed contribution amount (required for FIXED model)',
    example: 1000,
    required: false,
  })
  @ValidateIf((o) => o.contributionModel === ContributionModel.FIXED)
  @IsNotEmpty({ message: 'Contribution amount is required for FIXED model' })
  @IsInt({ message: 'Contribution amount must be an integer' })
  @Min(1, { message: 'Contribution amount must be at least 1' })
  contributionAmount?: number;

  @ApiProperty({
    description: 'Contribution frequency (required for FIXED model)',
    enum: ContributionFrequency,
    example: ContributionFrequency.MONTHLY,
    required: false,
  })
  @ValidateIf((o) => o.contributionModel === ContributionModel.FIXED)
  @IsNotEmpty({ message: 'Frequency is required for FIXED model' })
  @IsEnum(ContributionFrequency, { message: 'Invalid frequency' })
  frequency?: ContributionFrequency;

  @ApiProperty({
    description: 'Due day of the month/week (1-31 for monthly, 1-7 for weekly)',
    example: 15,
    required: false,
  })
  @ValidateIf((o) => o.contributionModel === ContributionModel.FIXED)
  @IsInt({ message: 'Due day must be an integer' })
  @Min(1, { message: 'Due day must be at least 1' })
  @Max(31, { message: 'Due day must be at most 31' })
  dueDay?: number;

  @ApiProperty({
    description: 'Grace period in days after due date',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Grace period days must be an integer' })
  @Min(0, { message: 'Grace period days must be at least 0' })
  gracePeriodDays?: number;

  @ApiProperty({
    description: 'Late payment fee amount',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Late payment fee must be an integer' })
  @Min(0, { message: 'Late payment fee must be at least 0' })
  latePaymentFee?: number;

  @ApiProperty({
    description: 'Minimum contribution amount (for FLEXIBLE model)',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Minimum contribution must be an integer' })
  @Min(1, { message: 'Minimum contribution must be at least 1' })
  minimumContribution?: number;

  @ApiProperty({
    description: 'Contribution guidelines text (for FLEXIBLE model)',
    example: 'Members are encouraged to contribute at least 500 per month',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Contribution guidelines must be a string' })
  contributionGuidelines?: string;

  @ApiProperty({
    description: 'Whether meeting attendance is required',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Require meeting attendance must be a boolean' })
  requireMeetingAttendance?: boolean;

  @ApiProperty({
    description: 'Whether member loans are enabled',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Enable member loans must be a boolean' })
  enableMemberLoans?: boolean;

  @ApiProperty({
    description: 'Whether automatic SMS reminders are enabled',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Automatic SMS reminders must be a boolean' })
  automaticSmsReminders?: boolean;
}
