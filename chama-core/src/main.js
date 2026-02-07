'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('./app.module');
const swagger_1 = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const firebaseAdmin = __importStar(require('firebase-admin'));
const fs = __importStar(require('fs'));
const path = __importStar(require('path'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
function bootstrap() {
  return __awaiter(this, void 0, void 0, function* () {
    const app = yield core_1.NestFactory.create(app_module_1.AppModule);
    // Configure cookie parser middleware for secure token storage
    app.use((0, cookie_parser_1.default)());
    // Set up API versioning
    app.enableVersioning({
      type: common_1.VersioningType.URI,
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
        'http://127.0.0.1:5500',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      exposedHeaders: ['Authorization'],
      maxAge: 86400, // 24 hours in seconds
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
    // Firebase initialization
    // Use absolute path based on project root directory
    const projectRoot = process.cwd(); // This will resolve to the project root directory
    const firebaseKeyFilePath = path.join(
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Firebase initialization error:', message);
      process.exit(1); // Exit the application on Firebase initialization error
    }
    yield app.listen(process.env.PORT || 5500);
  });
}
bootstrap();
