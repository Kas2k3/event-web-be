import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import {
  Pagination,
  PaginationMeta,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';

export async function createPagination<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: PaginationOptions,
): Promise<Pagination<T>> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  let queryBuilder: SelectQueryBuilder<T>;

  if (repositoryOrQueryBuilder instanceof Repository) {
    queryBuilder = repositoryOrQueryBuilder.createQueryBuilder('entity');
  } else {
    queryBuilder = repositoryOrQueryBuilder;
  }

  //search by word
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

  //filter by role and status
  if (options.filter) {
    Object.keys(options.filter).forEach((key) => {
      const value = options.filter![key];
      if (value !== undefined && value !== null) {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      }
    });
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

  return {
    items,
    meta,
  };
}