import { Cacheable } from '@type-cacheable/core';
import { getManager } from 'typeorm';

import { SettingEntity } from '@/entities/setting.entity';

import CacheUtil from './cache.util';

export default class SettingUtil {
  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getSGTemplateId') })
  static async getSGTemplateId(templateKey: string): Promise<string> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, { where: { key: templateKey } });

    return config?.valueString;
  }

  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getAppBaseUrl'), ttlSeconds: 300 })
  static async getAppBaseUrl(defaultUrl: string): Promise<string> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, { where: { key: 'APP_BASE_URL' } });

    return config?.valueString ?? defaultUrl;
  }

  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getAppPath'), ttlSeconds: 300 })
  static async getAppPath(key: string, defaultValue = ''): Promise<string> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, { where: { key: ['APP_PATH', key.toUpperCase()].join('_') } });

    return config?.valueString ?? defaultValue;
  }

  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getSigningDomain'), ttlSeconds: 300 })
  static async getSigningDomain(key: string): Promise<Record<string, any>> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, { where: { key: ['SIGNING_DOMAIN', key.toUpperCase()].join('_') } });

    return config?.valueJson;
  }

  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getAllowedMimeTypes'), ttlSeconds: 300 })
  static async getAllowedMimeTypes(variant = 'avatar'): Promise<string[]> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, {
      where: { key: [variant.toUpperCase(), 'ALLOWED_MIMETYPE'].join('_') },
    });

    return (config?.valueJson as string[]) ?? [];
  }

  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getDiscordServerId'), ttlSeconds: 300 })
  static async getDiscordServerId(): Promise<string> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, {
      where: { key: 'AIRDROP_DISCORD_SERVER_ID' },
    });

    return config?.valueString ?? '';
  }

  // @Cacheable({ cacheKey: CacheUtil.setCacheKey('SettingUtil_getTelegramChannelId'), ttlSeconds: 300 })
  static async getTelegramChannelId(): Promise<string> {
    const db = getManager();

    const config = await db.findOne(SettingEntity, {
      where: { key: 'AIRDROP_TELEGRAM_CHANNEL_ID' },
    });

    return config?.valueString ?? '';
  }
}
