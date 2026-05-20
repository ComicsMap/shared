import { Issue } from '@entities/issues/issue.entity';
import { Collection } from '@entities/users/collections/collection.entity';
import {
  Entity,
  ManyToOne,
  type Opt,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({
  tableName: 'collections_issues',
})
export class CollectionIssue {
  @ManyToOne(() => Collection, {
    name: 'collection_uuid',
    primary: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly collection!: Ref<Collection>;

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
