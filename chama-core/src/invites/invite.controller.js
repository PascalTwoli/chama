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
exports.InviteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const auth_guard_1 = require("../guards/auth.guard");
const create_invite_dto_1 = require("./dto/create-invite.dto");
const invite_service_1 = require("./invite.service");
const invite_entity_1 = require("./entities/invite.entity");
const membership_entity_1 = require("./entities/membership.entity");
let InviteController = class InviteController {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    /**
     * Creates a new invite to join a chama
     */
    createInvite(createInviteDto, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invite = yield this.inviteService.createInvite(createInviteDto, currentUser.id);
                return new invite_entity_1.InviteEntity(invite.invite);
            }
            catch (error) {
                this.handleError(error, 'Failed to create invite');
            }
        });
    }
    /**
     * Lists all pending invites for a specific chama
     */
    listPendingInvites(chamaId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invites = yield this.inviteService.listPendingInvites(chamaId, currentUser.id);
                return invites.map(invite => new invite_entity_1.InviteEntity(invite));
            }
            catch (error) {
                this.handleError(error, 'Failed to list pending invites');
            }
        });
    }
    /**
     * Accepts an invitation to join a chama
     */
    acceptInvite(acceptInviteDto, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membership = yield this.inviteService.validateAndAcceptInvite(acceptInviteDto.token, currentUser.id);
                return new membership_entity_1.MembershipEntity(membership);
            }
            catch (error) {
                this.handleError(error, 'Failed to accept invite');
            }
        });
    }
    /**
     * Gets all pending invites for the current user
     */
    getPendingInvitesForUser(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!currentUser.email) {
                throw new common_1.BadRequestException('User does not have an email address');
            }
            try {
                const invites = yield this.inviteService.getPendingInvitesForUser(currentUser.email);
                return invites.map(invite => new invite_entity_1.InviteEntity(invite));
            }
            catch (error) {
                this.handleError(error, 'Failed to get pending invites');
            }
        });
    }
    /**
     * Common error handler for controller methods
     */
    handleError(error, defaultMessage) {
        if (error instanceof common_1.HttpException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException(`${defaultMessage}: ${error.message || 'Unknown error'}`);
    }
};
exports.InviteController = InviteController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new invite to join a chama' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Invite created successfully',
        type: invite_entity_1.InviteEntity
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chama not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already a member or has pending invite' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invite_dto_1.CreateInviteDto, Object]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Get)('chama/:chamaId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all pending invites for a chama' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of pending invites',
        type: [invite_entity_1.InviteEntity]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chama not found' }),
    __param(0, (0, common_1.Param)('chamaId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "listPendingInvites", null);
__decorate([
    (0, common_1.Post)('accept'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accept an invite to join a chama' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invite accepted successfully',
        type: membership_entity_1.MembershipEntity
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired invite' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invite not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already a member of this chama' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invite_dto_1.AcceptInviteDto, Object]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "acceptInvite", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending invites for the current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of pending invites',
        type: [invite_entity_1.InviteEntity]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "getPendingInvitesForUser", null);
exports.InviteController = InviteController = __decorate([
    (0, swagger_1.ApiTags)('Invites'),
    (0, common_1.Controller)('invites'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.SerializeOptions)({
        strategy: 'excludeAll',
        excludePrefixes: ['_'],
    }),
    __metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteController);
