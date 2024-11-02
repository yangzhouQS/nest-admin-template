import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('s_menu_item', { schema: 'nest_auth' })
export class SMenuItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'uuid', nullable: true, length: 50 })
  uid: string | null;

  @Column('varchar', { name: 'original_id', nullable: true, length: 50 })
  originalId: string | null;

  @Column('varchar', { name: 'module_id', comment: '关联模块id', length: 50 })
  moduleId: string;

  @Column('varchar', { name: 'parent_id', comment: '父级菜单id', length: 50 })
  parentId: string;

  @Column('varchar', { name: 'name', comment: '菜单名称', length: 50 })
  name: string;

  @Column('varchar', { name: 'icon', comment: '图标', length: 50 })
  icon: string;

  @Column('int', { name: 'sort_num', comment: '排序', default: () => "'0'" })
  sortNum: number;

  @Column('tinyint', {
    name: 'is_disabled',
    comment: '是否禁用 0:正常,1:禁用',
    width: 1,
    default: () => "'0'",
  })
  isDisabled: boolean;

  @Column('tinyint', {
    name: 'is_default',
    comment: '是否为默认项',
    default: () => "'0'",
  })
  isDefault: number;

  @Column('varchar', {
    name: 'url_params',
    nullable: true,
    comment: 'URL参数',
    length: 255,
  })
  urlParams: string | null;

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
}
