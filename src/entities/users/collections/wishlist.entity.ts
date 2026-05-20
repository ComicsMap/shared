import { SystemCollection } from '@entities/users/collections/core/system-collection.entity';
import { WishlistIssue } from '@entities/users/collections/wishlist-issue.entity';
import {
  Entity,
  OneToMany,
  Collection as OrmCollection,
} from '@mikro-orm/core';

@Entity({
  tableName: 'wishlists',
})
export class Wishlist extends SystemCollection {
  @OneToMany(() => WishlistIssue, (entry) => entry.wishlist)
  readonly issues = new OrmCollection<WishlistIssue>(this);
}
