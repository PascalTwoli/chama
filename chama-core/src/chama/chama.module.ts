import { Module, forwardRef } from '@nestjs/common';
import { ChamaController } from './chama.controller';
import { ChamaService } from './chama.service';
import { UserModule } from '../user/user.module';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';

@Module({
  imports: [UserModule, forwardRef(() => RolesPermissionsModule)],
  controllers: [ChamaController],
  providers: [ChamaService],
  exports: [ChamaService],
})
export class ChamaModule {}
