"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const auth_guard_1 = require("../guards/auth.guard");
const chama_service_1 = require("./chama.service");
const create_chama_dto_1 = require("./dto/create-chama.dto");
let ChamaController = class ChamaController {
    constructor(chamaService) {
        this.chamaService = chamaService;
    }
    /**
     * Creates a new chama group
     */
    create(createChamaDto, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chamaService.create(createChamaDto, currentUser.id);
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException)
                    throw error;
                throw new common_1.BadRequestException(`Failed to create chama: ${error.message}`);
            }
        });
    }
    /**
     * Gets all chamas for the current user
     */
    findAll(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chamaService.findAll(currentUser.id);
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                throw new common_1.InternalServerErrorException(`Failed to fetch chamas: ${error.message}`);
            }
        });
    }
    /**
     * Gets a specific chama by ID
     */
    findOne(id, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chamaService.findOne(id, currentUser.id);
            }
            catch (error) {
                if (error instanceof common_1.NotFoundException) {
                    throw error;
                }
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                throw new common_1.InternalServerErrorException(`Failed to fetch chama: ${error.message}`);
            }
        });
    }
};
exports.ChamaController = ChamaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new chama' }),
    (0, swagger_1.ApiBody)({ type: create_chama_dto_1.CreateChamaDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The chama has been successfully created',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', description: 'Unique chama identifier' },
                name: { type: 'string', description: 'Name of the chama' },
                description: {
                    type: 'string',
                    description: 'Description of the chama',
                },
                userId: { type: 'string', description: 'ID of the creator' },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Creation timestamp',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Last update timestamp',
                },
                memberships: {
                    type: 'array',
                    description: 'List of users who are members of this chama',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Membership ID' },
                            chamaId: { type: 'string', description: 'Chama ID' },
                            userId: { type: 'string', description: 'User ID' },
                            role: {
                                type: 'string',
                                description: 'Role in the chama (ADMIN, MEMBER)',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Membership creation date',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Membership last update date',
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chama_dto_1.CreateChamaDto, Object]),
    __metadata("design:returntype", Promise)
], ChamaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all chamas for the logged-in user' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of chamas the user is a member of',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Unique chama identifier' },
                    name: { type: 'string', description: 'Name of the chama' },
                    description: {
                        type: 'string',
                        description: 'Description of the chama',
                    },
                    userId: { type: 'string', description: 'ID of the creator' },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update timestamp',
                    },
                    memberships: {
                        type: 'array',
                        description: 'List of users who are members of this chama',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'Membership ID' },
                                chamaId: { type: 'string', description: 'Chama ID' },
                                userId: { type: 'string', description: 'User ID' },
                                role: {
                                    type: 'string',
                                    description: 'Role in the chama (ADMIN, MEMBER)',
                                },
                                createdAt: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Membership creation date',
                                },
                                updatedAt: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Membership last update date',
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized - User not authenticated',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChamaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get a chama by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chama ID', type: 'string' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'The requested chama',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', description: 'Unique chama identifier' },
                name: { type: 'string', description: 'Name of the chama' },
                description: {
                    type: 'string',
                    description: 'Description of the chama',
                },
                userId: { type: 'string', description: 'ID of the creator' },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Creation timestamp',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Last update timestamp',
                },
                memberships: {
                    type: 'array',
                    description: 'List of users who are members of this chama',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Membership ID' },
                            chamaId: { type: 'string', description: 'Chama ID' },
                            userId: { type: 'string', description: 'User ID' },
                            role: {
                                type: 'string',
                                description: 'Role in the chama (ADMIN, MEMBER)',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Membership creation date',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Membership last update date',
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized - User not authenticated',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Chama not found or user does not have access',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChamaController.prototype, "findOne", null);
exports.ChamaController = ChamaController = __decorate([
    (0, swagger_1.ApiTags)('Chama'),
    (0, common_1.Controller)('chama'),
    __metadata("design:paramtypes", [chama_service_1.ChamaService])
], ChamaController);
