import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChamaDto } from './dto/create-chama.dto';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class ChamaService {
  constructor(private prisma: PrismaService) {}

  private async getUserFromToken(idToken: string) {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const firebaseUser = await firebaseAdmin.auth().getUser(decodedToken.uid);
    
    // Find user by email
    let user = await this.prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (!user) {
      // Create the user if they don't exist
      user = await this.prisma.user.create({
        data: {
          name: firebaseUser.displayName || decodedToken.name,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          role: 'MEMBER', // Default role in the system
        },
      });
    }

    return user;
  }

  async create(createChamaDto: CreateChamaDto, idToken: string) {
    try {
      const user = await this.getUserFromToken(idToken);

      // Create the chama with the confirmed user
      const chama = await this.prisma.chama.create({
        data: {
          name: createChamaDto.name,
          description: createChamaDto.description,
          userId: user.id,
          memberships: {
            create: {
              userId: user.id,
              role: 'ADMIN', // The creator is automatically an admin
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
      if (error.code && error.code.startsWith('auth/')) {
        throw new BadRequestException(`Authentication error: ${error.message}`);
      }
      throw new BadRequestException(`Failed to create chama: ${error.message}`);
    }
  }

  async findAll(idToken: string) {
    try {
      const user = await this.getUserFromToken(idToken);

      // Find all chamas where the user is a member
      const chamas = await this.prisma.chama.findMany({
        where: {
          memberships: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          memberships: true,
        },
      });

      return chamas;
    } catch (error) {
      console.error('Error finding chamas:', error);
      if (error.code && error.code.startsWith('auth/')) {
        throw new BadRequestException(`Authentication error: ${error.message}`);
      }
      throw new BadRequestException(`Failed to fetch chamas: ${error.message}`);
    }
  }

  async findOne(id: string, idToken: string) {
    try {
      const user = await this.getUserFromToken(idToken);

      // Find the chama and ensure the user is a member
      const chama = await this.prisma.chama.findFirst({
        where: {
          id: id,
          memberships: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          memberships: true,
        },
      });

      if (!chama) {
        throw new NotFoundException(`Chama with ID ${id} not found or you don't have access`);
      }

      return chama;
    } catch (error) {
      console.error(`Error finding chama with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code && error.code.startsWith('auth/')) {
        throw new BadRequestException(`Authentication error: ${error.message}`);
      }
      throw new BadRequestException(`Failed to fetch chama: ${error.message}`);
    }
  }
}

