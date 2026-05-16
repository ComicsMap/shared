import * as Constants from '@constants/issues.constants';
import { AuditableEntity } from '@entities/auditable.entity';
import { IssueLayout } from '@entities/issue-layout.entity';
import { IssueContributor } from '@entities/issues/issue-contributor.entity';
import { Series } from '@entities/series.entity';
import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  type Opt,
  Property,
  type Ref,
} from '@mikro-orm/core';

export enum Publisher {
  Marvel = 'MARVEL',
  DC = 'DC',
}

@Entity({
  tableName: 'issues',
})
@Index({
  name: 'idx_issues_publisher',
  properties: ['publisher'],
})
@Index({
  name: 'idx_issues_published_at',
  properties: ['publishedAt'],
})
export class Issue extends AuditableEntity {
  @Property({
    name: 'title',
    type: 'varchar',
    length: Constants.TITLE_MAX_LENGTH,
    nullable: false,
  })
  title!: string;

  @Property({
    name: 'synopsis',
    type: 'text',
    nullable: true,
  })
  synopsis?: string;

  @Enum({
    name: 'publisher',
    items: () => Publisher,
    nativeEnumName: 'publisher',
    nullable: false,
  })
  publisher!: Publisher;

  @ManyToOne(() => Series, {
    name: 'series_uuid',
    nullable: false,
    deleteRule: 'set null',
    ref: true,
  })
  series!: Ref<Series>;

  @Property({
    name: 'issue_number',
    columnType: 'numeric(5,1)',
    nullable: true,
  })
  issueNumber?: Opt<string>;

  @OneToMany(() => IssueContributor, (contributor) => contributor.issue)
  readonly contributors = new Collection<IssueContributor>(this);

  @OneToOne(() => IssueLayout, (layout) => layout.issue, {
    nullable: true,
    ref: true,
  })
  layout?: Ref<IssueLayout>;

  @Property({
    name: 'published_at',
    type: 'timestamp with time zone',
    nullable: false,
  })
  publishedAt!: Date;
}
