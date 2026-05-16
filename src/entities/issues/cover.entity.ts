import * as Constants from '@constants/covers.constants';
import { AuditableEntity } from '@entities/auditable.entity';
import { IssueContributor } from '@entities/issues/issue-contributor.entity';
import {
  Collection,
  Entity,
  Index,
  OneToMany,
  type Opt,
  Property,
} from '@mikro-orm/core';

@Entity({
  tableName: 'covers',
})
@Index({
  name: 'idx_covers_is_variant',
  properties: ['isVariant'],
})
export class Cover extends AuditableEntity {
  @Property({
    name: 'url',
    type: 'varchar',
    length: Constants.URL_MAX_LENGTH,
    nullable: false,
  })
  url!: string;

  @Property({
    name: 'is_variant',
    type: 'boolean',
    nullable: false,
    defaultRaw: 'false',
    onCreate: () => false,
  })
  isVariant!: boolean;

  @OneToMany(() => IssueContributor, (contributor) => contributor.cover)
  contributors = new Collection<IssueContributor>(this);

  @Property({
    name: 'barcodes',
    columnType: 'varchar[]',
    nullable: false,
    defaultRaw: "'{}'",
  })
  barcodes: Opt<string[]> = [];
}
