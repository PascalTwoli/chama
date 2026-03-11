import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaSettingsDto } from './dto/create-chama-settings.dto';
import { UpdateChamaSettingsDto } from './dto/update-chama-settings.dto';
import {
  ContributionModel,
  ContributionFrequency,
  chama_settings,
} from '@prisma/client';

export interface ChamaSettingsResponse {
  id: string;
  chamaId: string;
  contributionModel: ContributionModel;
  contributionAmount: number | null;
  frequency: ContributionFrequency | null;
  dueDay: number | null;
  gracePeriodDays: number | null;
  latePaymentFee: number | null;
  minimumContribution: number | null;
  contributionGuidelines: string | null;
  requireMeetingAttendance: boolean;
  enableMemberLoans: boolean;
  automaticSmsReminders: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ChamaSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToResponse(settings: chama_settings): ChamaSettingsResponse {
    return {
      id: settings.id,
      chamaId: settings.chama_id,
      contributionModel: settings.contribution_model,
      contributionAmount: settings.contribution_amount,
      frequency: settings.frequency,
      dueDay: settings.due_day,
      gracePeriodDays: settings.grace_period_days,
      latePaymentFee: settings.late_payment_fee,
      minimumContribution: settings.minimum_contribution,
      contributionGuidelines: settings.contribution_guidelines,
      requireMeetingAttendance: settings.require_meeting_attendance,
      enableMemberLoans: settings.enable_member_loans,
      automaticSmsReminders: settings.automatic_sms_reminders,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }

  private async verifyMembershipAndRole(
    chamaId: string,
    userId: string,
    requireAdmin: boolean = false,
  ): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        chama_id: chamaId,
        user_id: userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this chama');
    }

    if (requireAdmin) {
      if (!['CHAIRPERSON', 'TREASURER', 'SECRETARY'].includes(membership.role)) {
        throw new ForbiddenException(
          'Only chairpersons, treasurers, or secretaries can manage chama settings',
        );
      }
    }
  }

  private validateSettingsForModel(dto: CreateChamaSettingsDto | UpdateChamaSettingsDto): void {
    const model = dto.contributionModel;

    if (model === ContributionModel.FIXED) {
      if (!dto.contributionAmount) {
        throw new BadRequestException(
          'Contribution amount is required for FIXED contribution model',
        );
      }
      if (!dto.frequency) {
        throw new BadRequestException(
          'Frequency is required for FIXED contribution model',
        );
      }
      if (dto.dueDay !== undefined) {
        if (dto.frequency === ContributionFrequency.WEEKLY && dto.dueDay > 7) {
          throw new BadRequestException(
            'Due day must be between 1 and 7 for weekly frequency',
          );
        }
        if (dto.frequency === ContributionFrequency.MONTHLY && dto.dueDay > 31) {
          throw new BadRequestException(
            'Due day must be between 1 and 31 for monthly frequency',
          );
        }
      }
    }
  }

  async create(
    chamaId: string,
    createDto: CreateChamaSettingsDto,
    userId: string,
  ): Promise<ChamaSettingsResponse> {
    // Verify chama exists
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }

    // Verify user has permission
    await this.verifyMembershipAndRole(chamaId, userId, true);

    // Check if settings already exist
    const existingSettings = await this.prisma.chama_settings.findUnique({
      where: { chama_id: chamaId },
    });

    if (existingSettings) {
      throw new ConflictException('Settings already exist for this chama. Use PUT to update.');
    }

    // Validate settings based on contribution model
    this.validateSettingsForModel(createDto);

    const settings = await this.prisma.chama_settings.create({
      data: {
        chama_id: chamaId,
        contribution_model: createDto.contributionModel,
        contribution_amount: createDto.contributionAmount ?? null,
        frequency: createDto.frequency ?? null,
        due_day: createDto.dueDay ?? null,
        grace_period_days: createDto.gracePeriodDays ?? null,
        late_payment_fee: createDto.latePaymentFee ?? null,
        minimum_contribution: createDto.minimumContribution ?? null,
        contribution_guidelines: createDto.contributionGuidelines ?? null,
        require_meeting_attendance: createDto.requireMeetingAttendance ?? false,
        enable_member_loans: createDto.enableMemberLoans ?? false,
        automatic_sms_reminders: createDto.automaticSmsReminders ?? false,
      },
    });

    return this.mapToResponse(settings);
  }

  async findOne(chamaId: string, userId: string): Promise<ChamaSettingsResponse> {
    // Verify chama exists
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }

    // Verify user is a member (read access for all members)
    await this.verifyMembershipAndRole(chamaId, userId, false);

    const settings = await this.prisma.chama_settings.findUnique({
      where: { chama_id: chamaId },
    });

    if (!settings) {
      throw new NotFoundException(`Settings not found for chama ${chamaId}`);
    }

    return this.mapToResponse(settings);
  }

  async update(
    chamaId: string,
    updateDto: UpdateChamaSettingsDto,
    userId: string,
  ): Promise<ChamaSettingsResponse> {
    // Verify chama exists
    const chama = await this.prisma.chama.findUnique({
      where: { id: chamaId },
    });

    if (!chama) {
      throw new NotFoundException(`Chama with ID ${chamaId} not found`);
    }

    // Verify user has permission
    await this.verifyMembershipAndRole(chamaId, userId, true);

    // Check if settings exist
    const existingSettings = await this.prisma.chama_settings.findUnique({
      where: { chama_id: chamaId },
    });

    if (!existingSettings) {
      throw new NotFoundException(`Settings not found for chama ${chamaId}. Use POST to create.`);
    }

    // Merge existing settings with update for validation
    const mergedDto = {
      contributionModel: updateDto.contributionModel ?? existingSettings.contribution_model,
      contributionAmount: updateDto.contributionAmount ?? existingSettings.contribution_amount ?? undefined,
      frequency: updateDto.frequency ?? existingSettings.frequency ?? undefined,
      dueDay: updateDto.dueDay ?? existingSettings.due_day ?? undefined,
    };

    // Validate settings based on contribution model
    if (updateDto.contributionModel) {
      this.validateSettingsForModel(mergedDto as CreateChamaSettingsDto);
    }

    const settings = await this.prisma.chama_settings.update({
      where: { chama_id: chamaId },
      data: {
        ...(updateDto.contributionModel && { contribution_model: updateDto.contributionModel }),
        ...(updateDto.contributionAmount !== undefined && { contribution_amount: updateDto.contributionAmount }),
        ...(updateDto.frequency !== undefined && { frequency: updateDto.frequency }),
        ...(updateDto.dueDay !== undefined && { due_day: updateDto.dueDay }),
        ...(updateDto.gracePeriodDays !== undefined && { grace_period_days: updateDto.gracePeriodDays }),
        ...(updateDto.latePaymentFee !== undefined && { late_payment_fee: updateDto.latePaymentFee }),
        ...(updateDto.minimumContribution !== undefined && { minimum_contribution: updateDto.minimumContribution }),
        ...(updateDto.contributionGuidelines !== undefined && { contribution_guidelines: updateDto.contributionGuidelines }),
        ...(updateDto.requireMeetingAttendance !== undefined && { require_meeting_attendance: updateDto.requireMeetingAttendance }),
        ...(updateDto.enableMemberLoans !== undefined && { enable_member_loans: updateDto.enableMemberLoans }),
        ...(updateDto.automaticSmsReminders !== undefined && { automatic_sms_reminders: updateDto.automaticSmsReminders }),
      },
    });

    return this.mapToResponse(settings);
  }

  async getSettingsByChamaId(chamaId: string): Promise<chama_settings | null> {
    return this.prisma.chama_settings.findUnique({
      where: { chama_id: chamaId },
    });
  }

  validateContributionAmount(
    settings: chama_settings,
    amount: number,
  ): { valid: boolean; message?: string } {
    if (settings.contribution_model === ContributionModel.FIXED) {
      if (amount <= 0) {
        return {
          valid: false,
          message: 'Contribution amount must be greater than 0',
        };
      }
    } else if (settings.contribution_model === ContributionModel.FLEXIBLE) {
      if (settings.minimum_contribution && amount < settings.minimum_contribution) {
        return {
          valid: false,
          message: `Contribution amount must be at least ${settings.minimum_contribution} for this chama`,
        };
      }
    }

    return { valid: true };
  }
}
