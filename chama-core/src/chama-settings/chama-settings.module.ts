import { Module } from '@nestjs/common';
import { ChamaSettingsController } from './chama-settings.controller';
import { ChamaSettingsService } from './chama-settings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [ChamaSettingsController],
  providers: [ChamaSettingsService],
  exports: [ChamaSettingsService],
})
export class ChamaSettingsModule {}
