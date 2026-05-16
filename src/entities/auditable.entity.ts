import { User } from '@entities/users/user.entity';
import {
  Entity,
  Filter,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({ abstract: true })
@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
export abstract class AuditableEntity {
  @PrimaryKey({
    name: 'uuid',
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  readonly uuid: string = crypto.randomUUID();

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
  })
  readonly createdAt: Opt<Date> = new Date();

  @ManyToOne(() => User, {
    name: 'created_by',
    nullable: true,
    deleteRule: 'set null',
    ref: true,
  })
  createdBy?: Ref<User>;

  @Property({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();

  @ManyToOne(() => User, {
    name: 'updated_by',
    nullable: true,
    deleteRule: 'set null',
    ref: true,
  })
  updatedBy?: Ref<User>;

  @Property({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => User, {
    name: 'deleted_by',
    nullable: true,
    deleteRule: 'set null',
    ref: true,
  })
  deletedBy?: Ref<User>;
}
