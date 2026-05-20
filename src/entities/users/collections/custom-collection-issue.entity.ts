import { Issue } from '@entities/issues/issue.entity';
import { CustomCollection } from '@entities/users/collections/custom-collection.entity';
import {
  Entity,
  ManyToOne,
  type Opt,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({
  tableName: 'custom_collections_issues',
})
export class CustomCollectionIssue {
  @ManyToOne(() => CustomCollection, {
    name: 'custom_collection_uuid',
    primary: true,
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly customCollection!: Ref<CustomCollection>;

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
