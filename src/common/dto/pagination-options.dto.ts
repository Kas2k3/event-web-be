import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from 'src/users/entities/user.entity';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class UserFilterDto {
  @ApiPropertyOptional({
    description: 'Filter users by role names. Multiple values can be selected.',
    isArray: true,
    example: ['ADMIN', 'USER'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  roleNames?: string[];

  @ApiPropertyOptional({
    description:
      'Filter users by account status. Multiple values can be selected.',
    enum: UserStatus,
    isArray: true,
    example: ['ACTIVE', 'SUSPENDED'],
  })
  @IsOptional()
  @IsEnum(UserStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  statuses?: UserStatus[];
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The current page number (default: 1). Minimum value is 1.',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description:
      'The number of items per page (default: 10). Minimum is 1, maximum is 100.',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description:
      'Search keyword to filter results based on relevant fields (e.g., name, email).',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter options for roles and statuses.',
    type: UserFilterDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilterDto)
  filter?: UserFilterDto;

  @ApiPropertyOptional({
    description:
      'Sort order of the results: ascending (ASC) or descending (DESC).',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Field to sort by (default: createdAt)',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';
}
