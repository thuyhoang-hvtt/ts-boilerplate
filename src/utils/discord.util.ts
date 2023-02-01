import { logger } from 'ethers';

import DiscordBot from '@/common/discord/client';

export default class DiscordUtil {
  static async verifyJoinChannel(discordId: string, guildID: string): Promise<boolean> {
    logger.info(`Verify server (${guildID}) has member of id (${discordId})`);
    const bot = DiscordBot.getInstance();

    if (!discordId) {
      return false;
    }

    try {
      const server = await bot.client.guilds.fetch(guildID);
      await server.members.fetch(discordId);
    } catch (error) {
      logger.warn(error);
      return false;
    }
    return true;
  }
}
