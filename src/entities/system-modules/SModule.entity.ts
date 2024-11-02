import { Column, Entity, Index, OneToMany } from 'typeorm';
import { SPermissionEntryEntity } from './SPermissionEntry.entity';

@Index('idx_module_removed', ['isRemoved'], {})
@Index('idx_module_updated_at', ['updatedAt'], {})
@Entity('s_module', { schema: 'nest_auth' })
export class SModuleEntity {
  @Column('varchar', {
    primary: true,
    name: 'id',
    comment: '模块id',
    length: 50,
  })
  id: string;

  @Column('varchar', { name: 'uuid', nullable: true, length: 50 })
  uuid: string | null;

  @Column('varchar', { name: 'code', comment: '模块编码', length: 100 })
  code: string;

  @Column('varchar', { name: 'name', comment: '模块名称', length: 50 })
  name: string;

  @Column('varchar', {
    name: 'icon',
    nullable: true,
    comment: '模块图标',
    length: 1000,
  })
  icon: string | null;

  @Column('varchar', {
    name: 'application_type',
    comment: 'mobile移动端，web pc 终端类型',
    length: 10,
    default: () => "'web'",
  })
  applicationType: string;

  @Column('varchar', {
    name: 'module_type',
    comment: 'page / internal / tableau / fineReport 模块类型',
    length: 20,
  })
  moduleType: string;

  @Column('varchar', {
    name: 'url',
    nullable: true,
    comment: '模块地址',
    length: 1000,
  })
  url: string | null;

  @Column('tinyint', {
    name: 'access_control',
    comment: '是否权限控制',
    width: 1,
    default: () => "'0'",
  })
  accessControl: boolean;

  @Column('tinyint', {
    name: 'is_shortcut',
    nullable: true,
    comment: '快捷功能',
    default: () => "'0'",
  })
  isShortcut: number | null;

  @Column('tinyint', {
    name: 'is_new_window',
    comment: '是否打开新窗口',
    default: () => "'0'",
  })
  isNewWindow: number;

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

  @OneToMany(
    () => SPermissionEntryEntity,
    (sPermissionEntry) => sPermissionEntry.module,
  )
  sPermissionEntries: SPermissionEntryEntity[];
}
