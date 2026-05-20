import { Issue } from '@entities/issues/issue.entity';
import { Wishlist } from '@entities/users/collections/wishlist.entity';
import {
  Entity,
  ManyToOne,
  type Opt,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({
  tableName: 'wishlists_issues',
})
export class WishlistIssue {
  @ManyToOne(() => Wishlist, {
    name: 'wishlist_uuid',
    primary: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly wishlist!: Ref<Wishlist>;

  @ManyToOne(() => Issue, {
    name: 'issue_uuid',
    primary: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly issue!: Ref<Issue>;

  @Property({
    name: 'added_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
  })
  readonly addedAt: Opt<Date> = new Date();
}
