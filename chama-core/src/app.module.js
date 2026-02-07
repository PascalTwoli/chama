'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AppModule = void 0;
const common_1 = require('@nestjs/common');
const app_controller_1 = require('./app.controller');
const app_service_1 = require('./app.service');
const config_1 = require('@nestjs/config');
const user_module_1 = require('./user/user.module');
const auth_module_1 = require('./auth/auth.module');
const auth_guard_1 = require('./guards/auth.guard');
const prisma_module_1 = require('./prisma/prisma.module');
const chama_module_1 = require('./chama/chama.module');
const invite_module_1 = require('./invites/invite.module');
const transaction_module_1 = require('./transaction/transaction.module');
let AppModule = class AppModule {};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [
        config_1.ConfigModule.forRoot(),
        prisma_module_1.PrismaModule,
        user_module_1.UserModule,
        auth_module_1.AuthModule,
        chama_module_1.ChamaModule,
        invite_module_1.InviteModule,
        transaction_module_1.TransactionModule,
      ],
      controllers: [app_controller_1.AppController],
      providers: [app_service_1.AppService, auth_guard_1.AuthGuard],
    }),
  ],
  AppModule,
);
