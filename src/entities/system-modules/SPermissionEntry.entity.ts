import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { SModuleEntity } from './SModule.entity';

@Index('idx_permission_entry_module', ['moduleId'], {})
@Index('idx_permission_entry_removed', ['isRemoved'], {})
@Index('idx_permission_entry_updated_at', ['updatedAt'], {})
@Index('idx_permission_entry_user_apps', ['moduleId', 'isRemoved'], {})
@Entity('s_permission_entry', { schema: 'nest_auth' })
export class SPermissionEntryEntity {
  @Column('bigint', { primary: true, name: 'id', comment: 'id guid' })
  id: string;

  @Column('varchar', { name: 'uuid', nullable: true, length: 50 })
  uuid: string | null;

  @Column('varchar', { name: 'code', comment: 'code标识', length: 500 })
  code: string;

  @Column('varchar', { name: 'module_id', comment: '模块id', length: 50 })
  moduleId: string;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '权限名称',
    length: 50,
  })
  name: string | null;

  @Column('tinyint', { name: 'is_removed', width: 1, default: () => "'0'" })
  isRemoved: boolean;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => SModuleEntity, (sModule) => sModule.sPermissionEntries, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'module_id', referencedColumnName: 'id' }])
  module: SModuleEntity;
}
