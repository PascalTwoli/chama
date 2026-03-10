import { PartialType } from '@nestjs/swagger';
import { CreateChamaSettingsDto } from './create-chama-settings.dto';

export class UpdateChamaSettingsDto extends PartialType(CreateChamaSettingsDto) {}
