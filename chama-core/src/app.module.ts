import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { ChamaModule } from './chama/chama.module';
import { InviteModule } from './invites/invite.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    ChamaModule,
    InviteModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
