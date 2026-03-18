import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { ChamaSettingsModule } from '../chama-settings/chama-settings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, UserModule, ChamaSettingsModule, NotificationsModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
