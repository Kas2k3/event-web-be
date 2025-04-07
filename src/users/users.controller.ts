import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination-options.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ResponseMessage('User created successfully')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users with pagination.' })
  @ResponseMessage('Users retrieved successfully')
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<Pagination<User>> {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User retrieved successfully')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only access your own information');
    }

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'The user has been updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User updated successfully')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own information');
    }

    if (currentUser.role !== UserRole.ADMIN && updateUserDto.role) {
      throw new ForbiddenException('You cannot change your role');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a user (Admin only)' })
  @ApiResponse({ status: 200, description: 'The user has been soft deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User deleted successfully')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.usersService.remove(id, user.id);
    return { id, deleted: true };
  }

  @Delete(':id/hard')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hard delete a user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The user has been permanently deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User permanently deleted')
  async hardRemove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.hardRemove(id);
    return { id, deleted: true, permanent: true };
  }

  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted user (Admin only)' })
  @ApiResponse({ status: 200, description: 'The user has been restored.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User restored successfully')
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.restore(id);
    return { id, restored: true };
  }
}
