import { User } from '@entities/users/user.entity';
import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class AbstractCollection {
  @PrimaryKey({
    name: 'uuid',
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  readonly uuid: string = crypto.randomUUID();

  @ManyToOne(() => User, {
    name: 'owner_uuid',
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly owner!: Ref<User>;

  @Property({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();
}
