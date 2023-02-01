import { Client, GatewayIntentBits, GuildManager } from 'discord.js';

import LoggerMixing from '@/common/base/logger-mixing';
import { DiscordBotConfig } from '@/config';

export default class DiscordBot extends LoggerMixing {
  private static instance: DiscordBot;
  public client: Client;
  public guildManager: GuildManager;
  protected loggerName = 'DiscordBot';

  constructor() {
    super();
    this.client = new Client({ intents: [GatewayIntentBits.GuildMembers] });
    this.guildManager = this.client.guilds;
  }

  static init() {
    DiscordBot.instance = new DiscordBot();
    DiscordBot.instance.client.login(DiscordBotConfig.DISCORD_BOT_TOKEN);
  }

  static getInstance(): DiscordBot {
    if (DiscordBot.instance == null) {
      throw new Error(
        'People forgot to init DiscordBot. Put `DiscordBot.init(config)` on where application is initialized, then try again.',
      );
    }
    return DiscordBot.instance;
  }
}
