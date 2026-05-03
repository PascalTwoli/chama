import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { ContributionsRepository } from './contributions.repository';
import { PrismaService } from '../prisma/prisma.service';
import { FinanceModule } from '../finance/finance.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserModule } from '../user/user.module';
import { ChamaSettingsModule } from '../chama-settings/chama-settings.module';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';

@Module({
  imports: [
    FinanceModule,
    NotificationsModule,
    UserModule,
    ChamaSettingsModule,
    RolesPermissionsModule,
  ],
  controllers: [ContributionsController],
  providers: [ContributionsService, ContributionsRepository, PrismaService],
  exports: [ContributionsService],
})
export class ContributionsModule {}
