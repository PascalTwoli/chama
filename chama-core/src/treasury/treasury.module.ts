import { Module } from '@nestjs/common';
import { TreasuryController } from './treasury.controller';
import { TreasuryService } from './treasury.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TreasuryController],
  providers: [TreasuryService, PrismaService],
  exports: [TreasuryService],
})
export class TreasuryModule {}
