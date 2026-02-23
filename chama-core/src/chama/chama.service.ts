import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaDto } from './dto/create-chama.dto';
import { user_role, country } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ChamaService {
  constructor(private prisma: PrismaService) {}

  async create(createChamaDto: CreateChamaDto, userId: string) {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Create the chama
      const chama = await this.prisma.chama.create({
        data: {
          id: crypto.randomUUID(),
          name: createChamaDto.name,
          description: createChamaDto.description,
          rules: createChamaDto.rules,
          created_by: user.id,
          country: createChamaDto.country || country.KENYA,
          members_count: createChamaDto.membersCount || 1,
          organization_role: createChamaDto.organizationRole,
          updatedAt: new Date(),
        },
        include: {
          membership: true,
        },
      });

      return chama;
    } catch (error: unknown) {
      console.error('Error creating chama:', error);
      const errorWithCode = error as any;
      if (errorWithCode.code === 'P2002') {
        throw new BadRequestException('A chama with this name already exists');
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create chama: ${message}`);
    }
  }

  async findAll(userId: string) {
    try {
      const chamas = await this.prisma.chama.findMany({
        where: {
          membership: {
            some: { user_id: userId },
          },
        },
        include: {
          membership: true,
        },
      });
      return chamas;
    } catch (error: unknown) {
      console.error('Error finding chamas:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch chamas: ${message}`);
    }
  }

  async findAllAvailable(userId: string) {
    try {
      // Get all chamas that the user is NOT already a member of
      const chamas = await this.prisma.chama.findMany({
        where: {
          NOT: {
            membership: {
              some: { user_id: userId },
            },
          },
        },
        include: {
          membership: true,
        },
      });
      return chamas;
    } catch (error: unknown) {
      console.error('Error finding available chamas:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Failed to fetch available chamas: ${message}`,
      );
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const chama = await this.prisma.chama.findFirst({
        where: {
          id,
          membership: {
            some: { user_id: userId },
          },
        },
        include: {
          membership: true,
        },
      });
      if (!chama) {
        throw new NotFoundException(
          `Chama with ID ${id} not found or you don't have access`,
        );
      }
      return chama;
    } catch (error: unknown) {
      console.error(`Error finding chama with ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to fetch chama: ${message}`);
    }
  }
}
