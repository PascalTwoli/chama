import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ChamaSettingsModule } from '../chama-settings/chama-settings.module';
import { UserModule } from '../user/user.module';
import { FinanceController } from './finance.controller';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';

@Module({
  imports: [PrismaModule, ChamaSettingsModule, UserModule],
  controllers: [FinanceController],
  providers: [FinanceService, FinanceRepository],
  exports: [FinanceService],
})
export class FinanceModule {}
