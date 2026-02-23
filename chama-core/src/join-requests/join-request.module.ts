import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoinRequestService } from './join-request.service';
import { JoinRequestController } from './join-request.controller';
import { UserJoinRequestController } from './user-join-request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule, ConfigModule],
  controllers: [JoinRequestController, UserJoinRequestController],
  providers: [JoinRequestService],
  exports: [JoinRequestService],
})
export class JoinRequestModule {}
