import { UserStatus } from 'src/users/entities/user.entity';
import { SortOrder } from '../dto/pagination-options.dto';

export interface UserFilter {
  roleNames?: string[];
  statuses?: UserStatus[];
  [key: string]: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  filter?: UserFilter;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
}
