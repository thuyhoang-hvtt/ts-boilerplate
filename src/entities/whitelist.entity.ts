import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { WhiteList } from './whitelist.interface';

@Entity('core_whitelist')
export class WhiteListEntity extends BaseEntity implements WhiteList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authority: string;

  @Column()
  type: string;

  @Column({ nullable: true, type: 'json' })
  data: any;

  @Column({ nullable: true })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
