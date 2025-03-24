import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import {
  Pagination,
  PaginationMeta,
  PaginationLinks,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';

export async function createPagination<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: PaginationOptions,
): Promise<Pagination<T>> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const route = options.route || '';
  const skip = (page - 1) * limit;

  let queryBuilder: SelectQueryBuilder<T>;

  if (repositoryOrQueryBuilder instanceof Repository) {
    queryBuilder = repositoryOrQueryBuilder.createQueryBuilder('entity');
  } else {
    queryBuilder = repositoryOrQueryBuilder;
  }

  if (
    options.search &&
    options.searchFields &&
    options.searchFields.length > 0
  ) {
    const searchConditions = options.searchFields.map(
      (field) => `entity.${field} ILIKE :search`,
    );
    queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
      search: `%${options.search}%`,
    });
  }

  if (options.filter) {
    Object.keys(options.filter).forEach((key) => {
      const value = options.filter![key];
      if (value !== undefined && value !== null) {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      }
    });
  }

  if (options.sortBy) {
    queryBuilder.orderBy(
      `entity.${options.sortBy}`,
      options.sortOrder || 'DESC',
    );
  } else {
    queryBuilder.orderBy('entity.id', 'DESC');
  }

  queryBuilder.skip(skip).take(limit);

  const [items, totalItems] = await queryBuilder.getManyAndCount();

  const totalPages = Math.ceil(totalItems / limit);

  const meta: PaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage: page,
  };

  const links: PaginationLinks = {
    first: '',
    previous: '',
    next: '',
    last: '',
  };

  if (route) {
    const routeWithoutQuery = route.split('?')[0];
    links.first = `${routeWithoutQuery}?limit=${limit}`;
    links.last = `${routeWithoutQuery}?page=${totalPages}&limit=${limit}`;

    if (page > 1) {
      links.previous = `${routeWithoutQuery}?page=${page - 1}&limit=${limit}`;
    }

    if (page < totalPages) {
      links.next = `${routeWithoutQuery}?page=${page + 1}&limit=${limit}`;
    }
  }

  return {
    items,
    meta,
    links,
  };
}
