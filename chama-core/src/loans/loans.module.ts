import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { LoansRepository } from './loans.repository';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserModule } from '../user/user.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [NotificationsModule, UserModule, FinanceModule],
  controllers: [LoansController],
  providers: [LoansService, LoansRepository, PrismaService],
  exports: [LoansService],
})
export class LoansModule {}
