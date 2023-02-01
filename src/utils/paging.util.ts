import { EntityTarget, FindManyOptions } from 'typeorm';

import { PagingInfo, RequestPagingQuery } from '@/common/dtos/paging.dto';

import { logger } from './logger.util';

export default class PagingUtil {
  static isSupportedPaging(paging: RequestPagingQuery) {
    return (
      typeof paging.take === 'number' &&
      typeof paging.pageIndex === 'number' &&
      paging.take > 0 &&
      paging.pageIndex >= 0
    );
  }

  static buildPagingEntityQuery<Entity>(
    entity: EntityTarget<Entity>,
    paging: RequestPagingQuery,
  ): Pick<FindManyOptions, 'take' | 'skip' | 'order'> {
    const { pageIndex = 0, take = 20, orderBy, sortOrder = 'ASC' } = paging;
    const skip = pageIndex * take;
    const order = {};

    if (orderBy) {
      Object.assign(order, { [orderBy]: sortOrder });
    }

    logger.info(`Using pagination with take: ${take} - skip: ${skip}.`);
    return { skip, take, order };
  }

  static buildNextPage(currentPage: Partial<PagingInfo>, total: number): [boolean, PagingInfo] {
    const { pageIndex = 0, take = total } = currentPage;
    const isEnd = (pageIndex + 1) * take >= total;
    const nextPage = isEnd ? null : { pageIndex: pageIndex + 1, take, total };

    return [isEnd, nextPage];
  }
}
