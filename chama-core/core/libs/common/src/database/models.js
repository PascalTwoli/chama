"use strict";
/**
 * Centralized exports for all Prisma models and types
 *
 * This file provides a single entry point for importing Prisma-generated
 * types throughout the application, ensuring consistency and easier maintenance.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = exports.UserType = exports.TransactionStatus = exports.TransactionType = exports.DeliveryMethod = exports.PaymentStatus = exports.PaymentMethod = exports.ContributionStatus = exports.UserRole = void 0;
// Re-export all Prisma enums
var prisma_1 = require("../../../../../generated/prisma");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return prisma_1.UserRole; } });
Object.defineProperty(exports, "ContributionStatus", { enumerable: true, get: function () { return prisma_1.ContributionStatus; } });
Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return prisma_1.PaymentMethod; } });
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return prisma_1.PaymentStatus; } });
Object.defineProperty(exports, "DeliveryMethod", { enumerable: true, get: function () { return prisma_1.DeliveryMethod; } });
Object.defineProperty(exports, "TransactionType", { enumerable: true, get: function () { return prisma_1.TransactionType; } });
Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function () { return prisma_1.TransactionStatus; } });
Object.defineProperty(exports, "UserType", { enumerable: true, get: function () { return prisma_1.UserType; } });
// Import and re-export Prisma namespace for advanced types
const prisma_2 = require("../../../../../generated/prisma");
Object.defineProperty(exports, "Prisma", { enumerable: true, get: function () { return prisma_2.Prisma; } });
