import { Profile } from 'passport';
import { OAuth2Strategy, VerifyFunction } from 'passport-google-oauth';

import { RequestWithContext } from '@/common/interfaces/auth.interface';
import { OAuthGoogleConfig } from '@/config';
import { logger } from '@/utils/logger.util';

export interface IGoogleProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

const GoogleStrategy = new OAuth2Strategy(
  {
    clientID: OAuthGoogleConfig.OA_GOOGLE_ID,
    clientSecret: OAuthGoogleConfig.OA_GOOGLE_SECRET,
    callbackURL: OAuthGoogleConfig.OA_GOOGLE_CALLBACK,
    passReqToCallback: true,
  },
  (req: RequestWithContext, accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction) => {
    logger.info(`OAuth for profile: ${JSON.stringify(profile, null, 2)}`);
    req.user = profile;
    req.context.oauth = { accessToken, refreshToken, profile };
    done(null, profile);
  },
);

export default GoogleStrategy;
