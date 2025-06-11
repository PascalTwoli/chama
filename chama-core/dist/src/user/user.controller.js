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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../guards/auth.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./entities/user.entity");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async findAll(currentUser) {
        try {
            const response = await this.userService.findAll();
            return {
                users: response.users.map(user => new user_entity_1.FirebaseUserEntity({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                    emailVerified: user.emailVerified
                })),
                pageToken: response.pageToken
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch users: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const userResponse = await this.userService.findOne(id);
            return new user_entity_1.UserResponseEntity({
                firebaseUser: userResponse.firebaseUser ? {
                    uid: userResponse.firebaseUser.uid,
                    email: userResponse.firebaseUser.email,
                    displayName: userResponse.firebaseUser.displayName,
                    phoneNumber: userResponse.firebaseUser.phoneNumber,
                    emailVerified: userResponse.firebaseUser.emailVerified
                } : undefined,
                localUser: userResponse.localUser
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch user: ${error.message}`);
        }
    }
    async update(id, updateUserDto, currentUser) {
        console.log('=== PATCH /user/:id endpoint called ===');
        console.log('Request ID:', id);
        console.log('Request body (updateUserDto):', updateUserDto);
        console.log('Current user from token:', {
            id: currentUser?.id,
            email: currentUser?.email,
            firebaseUid: currentUser?.firebaseUid,
            fullUser: currentUser
        });
        try {
            if (currentUser.id !== id && currentUser.firebaseUid !== id) {
                console.log('=== AUTHORIZATION FAILED ===');
                console.log('- currentUser.id:', currentUser.id);
                console.log('- currentUser.firebaseUid:', currentUser.firebaseUid);
                console.log('- requested id:', id);
                console.log('- Neither currentUser.id nor currentUser.firebaseUid matches the requested id');
                throw new common_1.ForbiddenException('You are not authorized to update this user');
            }
            console.log('=== AUTHORIZATION PASSED ===');
            console.log('Proceeding with user update...');
            console.log('Calling userService.update with id:', id, 'and data:', updateUserDto);
            const userRecord = await this.userService.update(id, updateUserDto);
            console.log('userService.update result:', userRecord);
            return new user_entity_1.FirebaseUserEntity({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                phoneNumber: userRecord.phoneNumber,
                emailVerified: userRecord.emailVerified
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to update user: ${error.message}`);
        }
    }
    async remove(id, currentUser) {
        try {
            if (currentUser.id !== id) {
                throw new common_1.ForbiddenException('You are not authorized to delete this user');
            }
            await this.userService.remove(id);
            return { message: 'User deleted successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to delete user: ${error.message}`);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users',
        description: 'Returns a list of all users in the system',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of users',
        schema: {
            type: 'object',
            properties: {
                users: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/FirebaseUserEntity',
                    },
                },
                pageToken: { type: 'string', description: 'Token for pagination' },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'User not authenticated' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not authorized to view all users' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a user by ID',
        description: 'Returns detailed information about a specific user',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User details',
        type: user_entity_1.UserResponseEntity
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'User not authenticated' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a user',
        description: 'Updates a user\'s information',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User updated successfully',
        type: user_entity_1.FirebaseUserEntity
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid update data' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'User not authenticated' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not authorized to update this user' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a user',
        description: 'Deletes a user from the system',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID', type: 'string' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User deleted successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'User not authenticated' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User not authorized to delete this user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.SerializeOptions)({
        strategy: 'excludeAll',
        excludePrefixes: ['_'],
    }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map