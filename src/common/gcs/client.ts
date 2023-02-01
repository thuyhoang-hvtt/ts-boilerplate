import { Bucket, Storage, StorageOptions } from '@google-cloud/storage';

import LoggerMixing from '@/common/base/logger-mixing';
import { GCSConfig } from '@/config';

export default class GCStorage extends LoggerMixing {
  private static instance: GCStorage;
  public storage: Storage;
  public bucket: Bucket;
  private config: StorageOptions;
  protected loggerName = 'GCStorage';

  constructor(config: StorageOptions) {
    super();
    this.storage = new Storage(config);
    this.bucket = this.storage.bucket(GCSConfig.GCS_BUCKET_NAME);
    this.config = config;
  }

  static init(config: StorageOptions) {
    GCStorage.instance = new GCStorage(config);
  }

  static getInstance(): GCStorage {
    if (GCStorage.instance == null) {
      throw new Error(
        'People forgot to init SendGrid. Put `GCStorage.init(config)` on where application is initialized, then try again.',
      );
    }
    return GCStorage.instance;
  }
}
