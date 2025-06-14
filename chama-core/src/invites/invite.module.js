"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteModule = void 0;
const common_1 = require("@nestjs/common");
const invite_service_1 = require("./invite.service");
const invite_controller_1 = require("./invite.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const user_module_1 = require("../user/user.module");
const email_module_1 = require("../email/email.module");
const config_1 = require("@nestjs/config");
let InviteModule = class InviteModule {
};
exports.InviteModule = InviteModule;
exports.InviteModule = InviteModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, user_module_1.UserModule, email_module_1.EmailModule, config_1.ConfigModule],
        controllers: [invite_controller_1.InviteController],
        providers: [invite_service_1.InviteService],
        exports: [invite_service_1.InviteService],
    })
], InviteModule);
