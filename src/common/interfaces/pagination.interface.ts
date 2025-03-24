export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  route?: string;
  search?: string;
  searchFields?: string[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: Record<string, any>;
}
