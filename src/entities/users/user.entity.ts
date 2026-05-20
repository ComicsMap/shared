import * as Constants from '@constants/users.constants';
import { UserRole } from '@entities/enums/user-role.enum';
import type { Collection } from '@entities/users/collections/collection.entity';
import type { CustomCollection } from '@entities/users/collections/custom-collection.entity';
import type { Wishlist } from '@entities/users/collections/wishlist.entity';
import {
  Entity,
  Enum,
  Filter,
  Index,
  OneToMany,
  OneToOne,
  Collection as OrmCollection,
  type Opt,
  PrimaryKey,
  Property,
  type Ref,
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
@Index({
  name: 'idx_users_google_id',
  properties: ['googleId'],
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

  @Property({ name: 'password', type: 'varchar', nullable: true })
  password?: Opt<string>;

  @Property({
    name: 'google_id',
    type: 'varchar',
    length: Constants.GOOGLE_ID_MAX_LENGTH,
    nullable: true,
    unique: true,
  })
  googleId?: Opt<string>;

  @Property({
    name: 'avatar_url',
    type: 'varchar',
    length: Constants.AVATAR_URL_MAX_LENGTH,
    nullable: true,
  })
  avatarUrl?: Opt<string>;

  @Enum({
    name: 'role',
    items: () => UserRole,
    nativeEnumName: 'user_role',
    nullable: false,
    default: UserRole.User,
  })
  role!: Opt<UserRole>;

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
  deletedAt?: Opt<Date>;

  @OneToOne('Collection', (collection: Collection) => collection.owner, {
    ref: true,
  })
  collection?: Ref<Collection>;

  @OneToOne('Wishlist', (wishlist: Wishlist) => wishlist.owner, { ref: true })
  wishlist?: Ref<Wishlist>;

  @OneToMany(
    'CustomCollection',
    (collection: CustomCollection) => collection.owner,
  )
  readonly customCollections = new OrmCollection<CustomCollection>(this);
}
