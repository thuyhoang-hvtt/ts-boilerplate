import TelegramBot from 'node-telegram-bot-api';

import LoggerMixing from '@/common/base/logger-mixing';
import { TelegramBotConfig } from '@/config';

export default class Telebot extends LoggerMixing {
  private static instance: Telebot;
  public client: TelegramBot;
  protected loggerName = 'Telebot';

  constructor() {
    super();
    this.client = new TelegramBot(TelegramBotConfig.TELEGRAM_BOT_TOKEN, {
      polling: TelegramBotConfig.TELEGRAM_BOT_POOLING,
    });
  }

  static init() {
    Telebot.instance = new Telebot();
  }

  static getInstance(): Telebot {
    if (Telebot.instance == null) {
      throw new Error(
        'Human forgot to init Telebot. Put `Telebot.init(config)` on where application is initialized, then try again.',
      );
    }
    return Telebot.instance;
  }
}
