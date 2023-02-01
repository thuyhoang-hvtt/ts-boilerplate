import { ethers } from 'ethers';
import { EntityManager, getManager } from 'typeorm';

import LoggerMixing from '@/common/base/logger-mixing';

export interface IChainTopic {
  name: string;
  topicHash: string;
  process(iface: ethers.utils.Interface, logs: ethers.providers.Log[], context?: any): Promise<void>;
}

export default abstract class BaseTopic extends LoggerMixing implements IChainTopic {
  public name: string;
  public topicHash: string;
  public db: EntityManager;

  constructor() {
    super();
    this.db = getManager();
  }

  abstract process(iface: ethers.utils.Interface, logs: ethers.providers.Log[], context?: any): Promise<void>;
}
