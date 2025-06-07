import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UiSettings, Prisma } from '../models';

/**
 * Custom decorator for JSON fields
 * Handles serialization and validation of JSON data
 */
function JsonField(description?: string) {
  return function (target: any, propertyKey: string) {
    // Apply class-transformer Transform decorator
    Transform(({ value }) => {
      if (value === null || value === undefined) {
        return value;
      }
      
      // If it's already an object, return as-is
      if (typeof value === 'object') {
        return value;
      }
      
      // If it's a string, try to parse as JSON
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          // If parsing fails, return the original string
          return value;
        }
      }
      
      return value;
    })(target, propertyKey);
    
    // Apply ApiProperty decorator with dynamic description
    ApiProperty({
      description: description || `JSON field: ${propertyKey}`,
      type: 'object',
      additionalProperties: true,
      example: {},
    })(target, propertyKey);
  };
}

/**
 * Interface for widget visibility settings
 */
export interface WidgetSettings {
  dashboard?: {
    contributions?: boolean;
    transactions?: boolean;
    notifications?: boolean;
  };
  profile?: {
    personalInfo?: boolean;
    preferences?: boolean;
  };
  chama?: {
    membersList?: boolean;
    contributionHistory?: boolean;
  };
}

/**
 * UiSettings entity demonstrating JSON field handling
 * 
 * Shows how to properly handle Prisma Json fields with custom decorators
 * and type-safe interfaces for structured JSON data.
 */
export class UiSettingsEntity implements UiSettings {
  /**
   * User ID (primary key)
   */
  @ApiProperty({
    description: 'ID of the user these settings belong to',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  userId: string;

  /**
   * Whether to show tutorial to the user
   */
  @ApiProperty({
    description: 'Whether to show tutorial messages to the user',
    example: true,
  })
  @IsBoolean()
  showTutorial: boolean;

  /**
   * UI theme preference
   */
  @ApiProperty({
    description: 'Selected UI theme',
    example: 'dark',
  })
  @IsString()
  @IsOptional()
  theme: string | null;

  /**
   * Last seen widgets configuration (JSON field)
   */
  @JsonField('Configuration of widgets the user has seen or interacted with')
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  lastSeenWidgets: Prisma.JsonValue | null;

  constructor(partial: Partial<UiSettingsEntity>) {
    Object.assign(this, partial);
  }
}

/**
 * Helper functions for working with JSON fields
 */
export class JsonFieldUtils {
  /**
   * Safely parse JSON string to object
   */
  static safeJsonParse<T = any>(jsonString: string | null | undefined, defaultValue: T | null = null): T | null {
    if (!jsonString || typeof jsonString !== 'string') {
      return defaultValue;
    }
    
    try {
      return JSON.parse(jsonString) as T;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Safely stringify object to JSON
   */
  static safeJsonStringify(obj: any): string | null {
    if (obj === null || obj === undefined) {
      return null;
    }
    
    try {
      return JSON.stringify(obj);
    } catch {
      return null;
    }
  }

  /**
   * Merge widget settings with defaults
   */
  static mergeWidgetSettings(current: WidgetSettings | null, updates: Partial<WidgetSettings>): WidgetSettings {
    const defaultSettings: WidgetSettings = {
      dashboard: {
        contributions: true,
        transactions: true,
        notifications: true,
      },
      profile: {
        personalInfo: true,
        preferences: true,
      },
      chama: {
        membersList: true,
        contributionHistory: true,
      },
    };

    if (!current) {
      return { ...defaultSettings, ...updates };
    }

    return {
      dashboard: { ...defaultSettings.dashboard, ...current.dashboard, ...updates.dashboard },
      profile: { ...defaultSettings.profile, ...current.profile, ...updates.profile },
      chama: { ...defaultSettings.chama, ...current.chama, ...updates.chama },
    };
  }
}

