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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  PaginationDto,
  SortOrder,
} from 'src/common/dto/pagination-options.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ResponseMessage('User created successfully')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user; // Không cần trả về { message, data } nữa
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiQuery({ name: 'filter', required: false, type: 'object' })
  @ResponseMessage('Users retrieved successfully')
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<Pagination<User>> {
    return this.usersService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  @ResponseMessage('User retrieved successfully')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by id' })
  @ResponseMessage('User updated successfully')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 200, description: 'The user has been soft deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User deleted successfully')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.usersService.remove(id, user.id);
    return null;
  }

  @Delete(':id/hard')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hard delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been permanently deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User permanently deleted')
  async hardRemove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.hardRemove(id);
    return null;
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted user' })
  @ApiResponse({ status: 200, description: 'The user has been restored.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ResponseMessage('User restored successfully')
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.restore(id);
    return null;
  }
}