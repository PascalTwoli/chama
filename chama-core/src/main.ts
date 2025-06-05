import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS for frontend requests
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400, // 24 hours in seconds
  });

  const config = new DocumentBuilder()
    .setTitle('Chama Api')
    .setDescription('The API details for the chama management system backend')
    .setVersion('0.0.1')
    .addTag('Chama Api documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Firebase initialization
  // Use absolute path based on project root directory
  const projectRoot = process.cwd(); // This will resolve to the project root directory
  const firebaseKeyFilePath = path.join(
    projectRoot,
    'chama-b57f4-firebase-adminsdk-fbsvc-a743d47717.json'
  );
  console.log('Firebase key file path:', firebaseKeyFilePath);

  try {
    // Check if file exists first
    if (!fs.existsSync(firebaseKeyFilePath)) {
      throw new Error(
        `Firebase service account key file not found at: ${firebaseKeyFilePath}. ` +
        `Please make sure the file exists or set the FIREBASE_KEY_PATH environment variable to a valid path.`
      );
    }

    const firebaseServiceAccount = JSON.parse(
      fs.readFileSync(firebaseKeyFilePath).toString()
    );

    if (firebaseAdmin.apps.length === 0) {
      console.log('Initialize Firebase Application.');
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
      });
      console.log('Firebase Application initialized successfully.');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    process.exit(1); // Exit the application on Firebase initialization error
  }

  await app.listen(process.env.PORT || 5500);
}
bootstrap();