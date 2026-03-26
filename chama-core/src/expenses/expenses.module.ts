import { Module, OnModuleInit } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpensesRepository } from './expenses.repository';
import { FileUploadService } from './file-upload.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ExpensesController],
  providers: [
    ExpensesService,
    ExpensesRepository,
    FileUploadService,
    PrismaService,
  ],
  exports: [ExpensesService],
})
export class ExpensesModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Ensure default global expense categories exist
    const defaultCategories = [
      'Administrative',
      'Welfare',
      'Operations',
      'Reimbursements',
      'Events',
      'Miscellaneous',
    ];

    for (const name of defaultCategories) {
      await this.prisma.expense_category.upsert({
        where: {
          chama_id_name: {
            chama_id: 'global',
            name,
          },
        },
        create: {
          id: require('uuid').v4(),
          name,
          chama_id: null, // Global category
        },
        update: {},
      });
    }
  }
}
