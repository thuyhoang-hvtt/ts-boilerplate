import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

import { UserSocial } from './usersocial.interface';

@Entity('auth_usersocial')
export class UserSocialEntity extends BaseEntity implements UserSocial {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'twitter_id', nullable: true })
  twitterId?: string;

  @Column({ name: 'discord_id', nullable: true })
  discordId?: string;

  @Column({ name: 'telegram_id', nullable: true })
  telegramId?: string;

  @Column({ name: 'instagram_id', nullable: true })
  instagramId?: string;
}
