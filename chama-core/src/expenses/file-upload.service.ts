import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

interface FileUploadResult {
  filename: string;
  path: string;
  url: string;
  size: number;
}

@Injectable()
export class FileUploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'expenses');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDirExists();
  }

  /**
   * Ensure the upload directory exists, create if it doesn't
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: any): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  /**
   * Save uploaded file and return file information
   */
  async saveFile(file: any, expenseId: string): Promise<FileUploadResult> {
    // Validate file
    this.validateFile(file);

    // Generate filename: expense-{expenseId}-{timestamp}.{ext}
    const timestamp = Date.now();
    const ext = this.getFileExtension(file.originalname);
    const filename = `expense-${expenseId}-${timestamp}.${ext}`;

    const filePath = path.join(this.uploadDir, filename);

    // Save file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      path: filePath,
      url: `/uploads/expenses/${filename}`,
      size: file.size,
    };
  }

  /**
   * Delete a file
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);

    // Verify file is within uploads directory (security check)
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(this.uploadDir);

    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      throw new BadRequestException('Invalid file path');
    }

    // Delete file if it exists
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  /**
   * Extract file extension from filename
   */
  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length < 2) {
      return 'bin';
    }
    return parts[parts.length - 1].toLowerCase();
  }

  /**
   * Validate that a file URL belongs to this service
   */
  isValidFileUrl(url: string): boolean {
    return url.startsWith('/uploads/expenses/');
  }
}
