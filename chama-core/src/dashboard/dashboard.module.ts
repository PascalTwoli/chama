import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [PrismaModule, UserModule, FinanceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
