import * as Constants from '@constants/users.constants';
import {
  Entity,
  Filter,
  Index,
  type Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity({
  tableName: 'users',
})
@Index({
  name: 'idx_users_username',
  properties: ['username'],
})
@Index({
  name: 'idx_users_display_name',
  properties: ['displayName'],
})
@Index({
  name: 'idx_users_email',
  properties: ['email'],
})
@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
export class User {
  @PrimaryKey({
    name: 'uuid',
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  readonly uuid: string = crypto.randomUUID();

  @Property({
    name: 'username',
    type: 'varchar',
    length: Constants.USERNAME_MAX_LENGTH,
    nullable: false,
    unique: true,
  })
  username!: string;

  @Property({
    name: 'display_name',
    type: 'varchar',
    length: Constants.DISPLAY_NAME_MAX_LENGTH,
    nullable: true,
  })
  displayName?: Opt<string>;

  @Property({
    name: 'email',
    type: 'varchar',
    length: Constants.EMAIL_MAX_LENGTH,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Property({ name: 'password', type: 'varchar', nullable: false })
  password!: string;

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
  })
  readonly createdAt: Opt<Date> = new Date();

  @Property({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();

  @Property({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date;
}
