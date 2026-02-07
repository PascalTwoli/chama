import { Module } from '@nestjs/common';
import { ChamaController } from './chama.controller';
import { ChamaService } from './chama.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ChamaController],
  providers: [ChamaService],
  exports: [ChamaService],
})
export class ChamaModule {}
