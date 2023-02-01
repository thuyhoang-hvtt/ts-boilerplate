import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleEnum } from '@/common/interfaces/auth.interface';

import { User } from './user.interface';
import { UserReferralEntity } from './userreferral.entity';
import { UserReferral } from './userreferral.interface';
import { UserSocialEntity } from './usersocial.entity';
import { UserSocial } from './usersocial.interface';

@Entity('auth_users')
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  solana?: string;

  @Column({ nullable: true })
  aptos?: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified?: boolean;

  @Column({ nullable: true, type: 'varchar', length: 10 })
  nonce?: string;

  @Column({ nullable: true, name: 'chain_id' })
  chainId?: number;

  @Column('uuid', { nullable: true })
  uid?: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  role?: RoleEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToOne(() => UserReferralEntity, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  referral?: UserReferral;

  @OneToOne(() => UserSocialEntity, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  social?: UserSocialEntity;
}
