import { Profile } from 'passport';
import { Strategy } from 'passport-discord';

import { RequestWithContext } from '@/common/interfaces/auth.interface';
import { OAuthDiscordConfig } from '@/config';
import { logger } from '@/utils/logger.util';

export interface IDiscordProfile {
  id: string;
  username: string;
  avatar: any;
  avatar_decoration: any;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: any;
  banner_color: string;
  accent_color: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  email: string;
  verified: boolean;
  provider: string;
  accessToken: string;
  guilds: Guild[];
  fetchedAt: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

const DiscordStrategy = new Strategy(
  {
    clientID: OAuthDiscordConfig.OA_DISCORD_ID,
    clientSecret: OAuthDiscordConfig.OA_DISCORD_SECRET,
    callbackURL: OAuthDiscordConfig.OA_DISCORD_CALLBACK,
    scope: OAuthDiscordConfig.OA_DISCORD_SCOPE,
    passReqToCallback: true,
  },
  (req: RequestWithContext, accessToken: string, refreshToken: string, profile: Profile, done) => {
    logger.info(`OAuth for profile: ${JSON.stringify(profile, null, 2)}`);
    req.user = profile;
    req.context = { oauth: { accessToken, refreshToken, profile } };
    done(null, profile);
  },
);

export default DiscordStrategy;
