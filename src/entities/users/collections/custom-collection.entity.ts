import { CUSTOM_COLLECTION_TITLE_MAX_LENGTH } from '@constants/collections.constants';
import { AbstractCollection } from '@entities/users/collections/core/abstract-collection.entity';
import { CustomCollectionIssue } from '@entities/users/collections/custom-collection-issue.entity';
import {
  Entity,
  OneToMany,
  Collection as OrmCollection,
  Property,
  type Opt,
} from '@mikro-orm/core';

@Entity({
  tableName: 'custom_collections',
})
export class CustomCollection extends AbstractCollection {
  @Property({
    name: 'title',
    type: 'varchar',
    length: CUSTOM_COLLECTION_TITLE_MAX_LENGTH,
    nullable: false,
  })
  title!: string;

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
  })
  readonly createdAt: Opt<Date> = new Date();

  @Property({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Opt<Date>;

  @OneToMany(() => CustomCollectionIssue, (entry) => entry.customCollection)
  readonly issues = new OrmCollection<CustomCollectionIssue>(this);
}
