import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure cookie parser middleware for secure token storage
  app.use(cookieParser());

  // Set up API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-decorated properties
      forbidNonWhitelisted: true, // Throw error for non-decorated properties
      transform: true, // Transform payload to DTO instance
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Enable CORS for frontend requests
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400, // 24 hours in seconds
  });

  // Setup Swagger before Firebase initialization
  const config = new DocumentBuilder()
    .setTitle('Chama Api')
    .setDescription('The API details for the chama management system backend')
    .setVersion('0.0.1')
    .addTag('Chama Api documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger at /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'ChamaPlus API',
  });

  // Firebase initialization
  // Use FIREBASE_KEY_PATH env var or fallback to default filename
  const projectRoot = process.cwd();
  const firebaseKeyFilePath = process.env.FIREBASE_KEY_PATH
    ? path.isAbsolute(process.env.FIREBASE_KEY_PATH)
      ? process.env.FIREBASE_KEY_PATH
      : path.join(projectRoot, process.env.FIREBASE_KEY_PATH)
    : path.join(
        projectRoot,
        'chama-b57f4-firebase-adminsdk-fbsvc-a743d47717.json',
      );
  console.log('Firebase key file path:', firebaseKeyFilePath);

  try {
    // Check if file exists first
    if (!fs.existsSync(firebaseKeyFilePath)) {
      throw new Error(
        `Firebase service account key file not found at: ${firebaseKeyFilePath}. ` +
          `Please make sure the file exists or set the FIREBASE_KEY_PATH environment variable to a valid path.`,
      );
    }

    const firebaseServiceAccount = JSON.parse(
      fs.readFileSync(firebaseKeyFilePath).toString(),
    );

    if (firebaseAdmin.apps.length === 0) {
      console.log('Initialize Firebase Application.');
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
      });
      console.log('Firebase Application initialized successfully.');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Firebase initialization error:', message);
    process.exit(1); // Exit the application on Firebase initialization error
  }

  const port = process.env.PORT || 5500;
  await app.listen(port);

  // Log server info with clickable links
  console.log('\n========================================');
  console.log('🚀 ChamaPlus Backend Server Started');
  console.log('========================================');
  console.log(`📡 API:     http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
  console.log('========================================\n');
}
bootstrap();
