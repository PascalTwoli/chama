"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const firebaseAdmin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');
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
        maxAge: 86400,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Chama Api')
        .setDescription('The API details for the chama management system backend')
        .setVersion('0.0.1')
        .addTag('Chama Api documentation')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const projectRoot = process.cwd();
    const firebaseKeyFilePath = path.join(projectRoot, 'chama-b57f4-firebase-adminsdk-fbsvc-a743d47717.json');
    console.log('Firebase key file path:', firebaseKeyFilePath);
    try {
        if (!fs.existsSync(firebaseKeyFilePath)) {
            throw new Error(`Firebase service account key file not found at: ${firebaseKeyFilePath}. ` +
                `Please make sure the file exists or set the FIREBASE_KEY_PATH environment variable to a valid path.`);
        }
        const firebaseServiceAccount = JSON.parse(fs.readFileSync(firebaseKeyFilePath).toString());
        if (firebaseAdmin.apps.length === 0) {
            console.log('Initialize Firebase Application.');
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
            });
            console.log('Firebase Application initialized successfully.');
        }
    }
    catch (error) {
        console.error('Firebase initialization error:', error.message);
        process.exit(1);
    }
    await app.listen(process.env.PORT || 5500);
}
bootstrap();
//# sourceMappingURL=main.js.map