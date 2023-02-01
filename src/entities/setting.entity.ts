import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { Setting } from '@/entities/setting.interface';

@Entity('core_settings')
export class SettingEntity extends BaseEntity implements Setting {
  @PrimaryColumn({ type: 'varchar', length: 250 })
  key: string;

  @Column({ name: 'value_int', nullable: true })
  valueInt?: number;

  @Column({ name: 'value_float', nullable: true })
  valueFloat?: number;

  @Column({ name: 'value_string', nullable: true })
  valueString?: string;

  @Column({ name: 'value_json', type: 'json', nullable: true })
  valueJson?: Record<string, any> | any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
