import { JsonFragment } from '@ethersproject/abi';
import { CronJob } from 'cron';
import { ethers } from 'ethers';
import { isNil, snakeCase } from 'lodash';
import { EntityManager, getManager } from 'typeorm';

import LoggerMixing from '@/common/base/logger-mixing';
import { SettingEntity } from '@/entities/setting.entity';

import { IChainTopic } from './chain.topic';

export interface IChainInitializeOptions {
  rpcUrl: string;
  contractAddress: string;
  contractAbi: JsonFragment[];
  startAtBlock: number;
}

export interface IChainListener {
  name: string;
  cronExpression: string;
  topics: IChainTopic[];
}

const BLOCK_PADDING = 5;
const BLOCK_READ_PER_TIME = 500;

export class ChainListener extends LoggerMixing {
  protected loggerName = 'ChainListener';
  private _prefix = 'CHAIN_LISTENER__';
  public name: string;
  public cronExpression: string;
  public cronJob: CronJob;
  public now: Date;
  public topics: IChainTopic[];
  public rpcUrl: string;
  public provider: ethers.providers.StaticJsonRpcProvider;
  public iface: ethers.utils.Interface;
  public contractAddress: string;
  public db: EntityManager;
  public lastBlock: number;
  public latestBlock: number;

  constructor(options: IChainListener) {
    super();
    this.name = options.name;
    this.topics = options.topics;
    this.cronExpression = options.cronExpression;
    this.db = getManager();
  }

  public get key(): string {
    return this._prefix + snakeCase(this.name).toUpperCase();
  }

  async initialize(options: IChainInitializeOptions): Promise<void> {
    try {
      this.logger.info(`Initialize Chain Listener ${this.name}`);
      let setting = await this.db.findOne(SettingEntity, { where: { key: this.key } });
      if (isNil(setting)) {
        setting = await this.db.save(SettingEntity, { key: this.key, valueInt: options.startAtBlock || 0 });
      }

      this.provider = new ethers.providers.StaticJsonRpcProvider(options.rpcUrl);
      this.iface = new ethers.utils.Interface(options.contractAbi);
      this.lastBlock = setting.valueInt;
      this.contractAddress = options.contractAddress;
      this.cronJob = new CronJob({
        cronTime: this.cronExpression,
        onTick: () => this.run(),
        context: this,
      });

      this.logger.info('Finished Initializing.');
      this.logger.info('||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
      this.cronJob.start();
    } catch (exception) {
      this.logger.error(exception.message);
      this.cronJob?.stop();
    }
  }

  async run(): Promise<void> {
    this.logger.info('========================================================');
    this.logger.info(`Scanning all first ${this.getPaddingLastBlock()} blocks.`);
    const upperBoundBlock = await this.getUpperBoundBlock();

    if (upperBoundBlock <= this.lastBlock) {
      this.logger.info(`You're up-to. Progress ${this.lastBlock}/${this.latestBlock}`);
      this.logger.info('========================================================');
      return;
    }

    try {
      for (const topic of this.topics) {
        const filter: ethers.providers.Filter = {
          address: this.contractAddress,
          fromBlock: this.lastBlock + 1,
          toBlock: upperBoundBlock,
          topics: [topic.topicHash],
        };
        const logs = await this.provider.getLogs(filter);

        await topic.process(this.iface, logs, this);
      }
    } catch (exception) {
      this.logger.error(exception.message);
      this.logger.info('========================================================');
      return;
    }

    this.persistLastBlock(upperBoundBlock);
    this.logger.info(`          Progress ${this.lastBlock}/${this.latestBlock}`);
    this.logger.info('========================================================');
  }

  private persistLastBlock(blockNumber: number) {
    this.lastBlock = blockNumber;
    this.db.save(SettingEntity, { key: this.key, valueInt: blockNumber });
  }

  private getPaddingLastBlock() {
    return this.lastBlock.toString().padStart(29, '0');
  }

  private async getUpperBoundBlock(): Promise<number> {
    this.latestBlock = await this.provider.getBlockNumber();
    return Math.min(this.latestBlock - BLOCK_PADDING, this.lastBlock + BLOCK_READ_PER_TIME);
  }
}
