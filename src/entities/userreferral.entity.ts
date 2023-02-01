import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { UserReferral } from './userreferral.interface';

@Entity('auth_userreferral')
export class UserReferralEntity extends BaseEntity implements UserReferral {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'referral_code', type: 'varchar', length: 25 })
  referralCode: string;

  @Column({ name: 'referral_from', type: 'varchar', length: 25, nullable: true })
  referralFrom?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
