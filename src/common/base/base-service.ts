import { EntityManager, getManager } from 'typeorm';

import LoggerMixing from './logger-mixing';

export default abstract class BaseService extends LoggerMixing {
  protected db: EntityManager;
  constructor() {
    super();
    this.db = getManager();
  }
}
