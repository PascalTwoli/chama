import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chama Api')
    .setDescription('The API details for the chama management system backend')
    .setVersion('0.0.1')
    .addTag('Chama Api documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //firebase ;
  const firebaseKeyFilePath =
    './chama-b57f4-firebase-adminsdk-fbsvc-7f7a256f71.json';
  const firebaseServiceAccount /*: ServiceAccount*/ = JSON.parse(
    fs.readFileSync(firebaseKeyFilePath).toString(),
  );
  if (firebaseAdmin.apps.length === 0) {
    console.log('Initialize Firebase Application.');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    });
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
