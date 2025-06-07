import { IsUUID, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Base entity class that implements common fields for all database entities
 * 
 * This abstract class provides the standard id, createdAt, and updatedAt fields
 * that are common across most database models in the application.
 * 
 * @template T - The type of the entity that extends this base class
 */
export abstract class Entity<T = any> {
  /**
   * Unique identifier for the entity
   */
  @ApiProperty({
    description: 'Unique identifier',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID(4)
  id: string;

  /**
   * Timestamp when the entity was created
   */
  @ApiProperty({
    description: 'Date and time when the entity was created',
    example: '2025-06-07T09:35:54.000Z',
  })
  @IsDate()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  createdAt: Date;

  /**
   * Timestamp when the entity was last updated
   */
  @ApiProperty({
    description: 'Date and time when the entity was last updated',
    example: '2025-06-07T09:35:54.000Z',
  })
  @IsDate()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  updatedAt: Date;

  /**
   * Constructor that allows partial initialization of the entity
   * 
   * @param partial - Partial object containing entity properties
   */
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}

