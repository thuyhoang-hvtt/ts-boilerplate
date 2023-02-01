import { Cacheable } from '@type-cacheable/core';
import axios from 'axios';
import lodash from 'lodash';
import { BadRequestError } from 'routing-controllers';

import { EnvironmentConfig } from '@/config';

import CacheUtil from './cache.util';

interface IERC20Price {
  address?: string;
  price?: string;
  name?: string;
  symbol?: string;
}

export default class PriceUtil {
  @Cacheable({ cacheKey: CacheUtil.setCacheKey('PriceUtil_getERC20Token'), ttlSeconds: 300 })
  static async getERC20Token(address: string): Promise<IERC20Price> {
    const baseUrl =
      'https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=:address&vs_currencies=usd';

    try {
      const transformAddress = (
        address === '0x0000000000000000000000000000000000000000'
          ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
          : address
      ).toLowerCase();
      const response = await axios.get(baseUrl.replace(':address', transformAddress));
      const body = response.data;
      const priceInUSD = lodash.get(body, [transformAddress, 'usd'], 0).toString();
      return {
        address,
        price: priceInUSD.slice(0, 10),
      } as IERC20Price;
    } catch (error) {
      if (EnvironmentConfig.NODE_ENV !== 'production') {
        const response = await axios.get(baseUrl.replace(':address', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'));
        const body = response.data;
        return {
          address,
          price: body?.data.price.slice(0, 10),
          name: body?.data.name,
          symbol: body?.data.symbol,
        } as IERC20Price;
      } else {
        throw new BadRequestError('Token Not Found');
      }
    }
  }
}
