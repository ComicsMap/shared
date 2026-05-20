import { CollectionIssue } from '@entities/users/collections/collection-issue.entity';
import { SystemCollection } from '@entities/users/collections/core/system-collection.entity';
import {
  Entity,
  OneToMany,
  Collection as OrmCollection,
} from '@mikro-orm/core';

@Entity({
  tableName: 'collections',
})
export class Collection extends SystemCollection {
  @OneToMany(() => CollectionIssue, (entry) => entry.collection)
  readonly issues = new OrmCollection<CollectionIssue>(this);
}
