import { logger } from 'ethers';

import Telebot from '@/common/telegram/client';

export default class TelegramUtil {
  static async verifyJoinChannel(telegramId: string, channelId: string): Promise<boolean> {
    logger.info(`Verify channel (${channelId}) has member of id (${telegramId})`);
    const bot = Telebot.getInstance();

    if (!telegramId) {
      return false;
    }

    try {
      const response = await bot.client.getChatMember(channelId, telegramId);
      return ['administrator', 'creator', 'member'].includes(response.status);
    } catch (error) {
      logger.warn(error);
      return false;
    }
  }
}
