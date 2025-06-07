import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ExtendedDatabaseService } from './extended-database.service';

/**
 * Database Module for NestJS integration
 * 
 * Provides database services as global providers that can be injected
 * throughout the application.
 */
@Global()
@Module({
  providers: [
    DatabaseService,
    ExtendedDatabaseService,
  ],
  exports: [
    DatabaseService,
    ExtendedDatabaseService,
  ],
})
export class DatabaseModule {}

