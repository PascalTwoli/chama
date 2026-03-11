import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { ChamaModule } from './chama/chama.module';
import { InviteModule } from './invites/invite.module';
import { JoinRequestModule } from './join-requests/join-request.module';
import { TransactionModule } from './transaction/transaction.module';
import { ChamaSettingsModule } from './chama-settings/chama-settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    ChamaModule,
    InviteModule,
    JoinRequestModule,
    TransactionModule,
    ChamaSettingsModule,
    DashboardModule,
    RolesPermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
