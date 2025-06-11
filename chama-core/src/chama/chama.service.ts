import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaDto } from './dto/create-chama.dto';

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
          name: createChamaDto.name,
          description: createChamaDto.description,
          userId: user.id,
          country: 'KENYA', // Default country - you might want to make this configurable
          membersCount: 1, // Starting with the creator as the first member
          memberships: {
            create: {
              userId: user.id,
              role: 'ADMIN', // Creator is admin
            },
          },
        },
        include: {
          memberships: true,
        },
      });

      return chama;
    } catch (error) {
      console.error('Error creating chama:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('A chama with this name already exists');
      }
      throw new BadRequestException(`Failed to create chama: ${error.message}`);
    }
  }

  async findAll(userId: string) {
    try {
      const chamas = await this.prisma.chama.findMany({
        where: {
          memberships: {
            some: { userId },
          },
        },
        include: {
          memberships: true,
        },
      });
      return chamas;
    } catch (error) {
      console.error('Error finding chamas:', error);
      throw new BadRequestException(`Failed to fetch chamas: ${error.message}`);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const chama = await this.prisma.chama.findFirst({
        where: {
          id,
          memberships: {
            some: { userId },
          },
        },
        include: {
          memberships: true,
        },
      });
      if (!chama) {
        throw new NotFoundException(
          `Chama with ID ${id} not found or you don't have access`,
        );
      }
      return chama;
    } catch (error) {
      console.error(`Error finding chama with ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to fetch chama: ${error.message}`);
    }
  }
}
