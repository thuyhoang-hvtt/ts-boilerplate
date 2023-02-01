export default class CacheUtil {
  /**
   * Generates cache_key based on function arguments
   * @param prefix: case-intensive prefix for cache key;
   */
  static setCacheKey = (prefix?: string) => (args: any[]) => {
    return `${(prefix ?? '').toUpperCase()}__${args.join(':')}`;
  };
}
