import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesPermissionsService } from './roles-permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignMemberRoleDto } from './dto/assign-member-role.dto';
import { AssignSystemRoleDto } from './dto/assign-system-role.dto';

@ApiTags('Roles & Permissions')
@Controller()
export class RolesPermissionsController {
  constructor(
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  // ─── Roles ───────────────────────────────────────────────────────

  @Get('roles')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all organizational roles for a chama',
  })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiOkResponse({ description: 'List of roles' })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  async getRoles(
    @Query('chamaId') chamaId: string,
    @CurrentUser() _currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.getRoles(chamaId);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch roles: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post('roles')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a custom role' })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiBody({ type: CreateRoleDto })
  @ApiCreatedResponse({ description: 'Role created successfully' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  @ApiBadRequestResponse({ description: 'Invalid data or duplicate name' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createRole(
    @Query('chamaId') chamaId: string,
    @Body() dto: CreateRoleDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.createRole(
        chamaId,
        currentUser.id,
        dto,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Put('roles/:roleId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'roleId', type: String })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ description: 'Role updated successfully' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateRole(
    @Param('roleId') roleId: string,
    @Query('chamaId') chamaId: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.updateRole(
        roleId,
        chamaId,
        currentUser.id,
        dto,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Delete('roles/:roleId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a custom role (default roles cannot be deleted)' })
  @ApiParam({ name: 'roleId', type: String })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiOkResponse({ description: 'Role deleted successfully' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  @ApiBadRequestResponse({ description: 'Cannot delete default role' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async deleteRole(
    @Param('roleId') roleId: string,
    @Query('chamaId') chamaId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      await this.rolesPermissionsService.deleteRole(
        roleId,
        chamaId,
        currentUser.id,
      );
      return { message: 'Role deleted successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // ─── Permissions ─────────────────────────────────────────────────

  @Get('permissions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all available permissions' })
  @ApiOkResponse({ description: 'List of permissions' })
  async getAllPermissions(@CurrentUser() _currentUser: CurrentUserType) {
    try {
      return await this.rolesPermissionsService.getAllPermissions();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch permissions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // ─── Permissions Matrix ──────────────────────────────────────────

  @Get('roles/permissions-matrix')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get permissions matrix for the UI' })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiOkResponse({ description: 'Permissions matrix' })
  async getPermissionsMatrix(
    @Query('chamaId') chamaId: string,
    @CurrentUser() _currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.getPermissionsMatrix(chamaId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch permissions matrix: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // ─── Role Statistics ─────────────────────────────────────────────

  @Get('roles/stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role member counts for dashboard cards' })
  @ApiQuery({ name: 'chamaId', required: true, type: String })
  @ApiOkResponse({ description: 'Role statistics' })
  async getRoleStats(
    @Query('chamaId') chamaId: string,
    @CurrentUser() _currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.getRoleStats(chamaId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch role stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // ─── Member Role Assignment ──────────────────────────────────────

  @Put('members/:memberId/role')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign or change organizational role for a member' })
  @ApiParam({ name: 'memberId', type: String })
  @ApiBody({ type: AssignMemberRoleDto })
  @ApiOkResponse({ description: 'Role assigned successfully' })
  @ApiForbiddenResponse({ description: 'Not authorized' })
  @ApiNotFoundResponse({ description: 'Member or role not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async assignMemberRole(
    @Param('memberId') memberId: string,
    @Body() dto: AssignMemberRoleDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.assignMemberRole(
        memberId,
        dto.chamaId,
        dto.roleId,
        currentUser.id,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to assign role: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // ─── System Role Assignment ──────────────────────────────────────

  @Put('system-role/:memberId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign ADMIN system role (OWNER only)' })
  @ApiParam({ name: 'memberId', type: String })
  @ApiBody({ type: AssignSystemRoleDto })
  @ApiOkResponse({ description: 'System role assigned successfully' })
  @ApiForbiddenResponse({ description: 'Only OWNER can assign system roles' })
  @ApiBadRequestResponse({ description: 'Cannot reassign OWNER role' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async assignSystemRole(
    @Param('memberId') memberId: string,
    @Body() dto: AssignSystemRoleDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    try {
      return await this.rolesPermissionsService.assignSystemRole(
        memberId,
        dto.chamaId,
        dto.systemRole,
        currentUser.id,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to assign system role: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
