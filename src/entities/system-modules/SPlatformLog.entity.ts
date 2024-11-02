import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('s_platform_log', { schema: 'nest_auth' })
export class SPlatformLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: '主键' })
  id: string;

  @Column('varchar', { name: 'uuid', nullable: true, length: 50 })
  uuid: string | null;

  @Column('bigint', { name: 'tenant_id', nullable: true, comment: '租户id' })
  tenantId: string | null;

  @Column('varchar', { name: 'user_id', comment: '操作人账户', length: 50 })
  userId: string;

  @Column('varchar', {
    name: 'type',
    comment: '日志类型: operator, tenant, contract, license',
    length: 50,
  })
  type: string;

  @Column('varchar', { name: 'object_id', length: 100 })
  objectId: string;

  @Column('varchar', { name: 'operation', comment: '操作类型', length: 50 })
  operation: string;

  @Column('text', { name: 'params', comment: '操作参数内容' })
  params: string;

  @Column('text', { name: 'old_value', nullable: true, comment: '原数据' })
  oldValue: string | null;

  @Column('text', { name: 'cur_value', comment: '新数据' })
  curValue: string;

  @Column('text', { name: 'content', comment: '操作内容' })
  content: string;

  @Column('datetime', {
    name: 'created_at',
    comment: '记录创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
