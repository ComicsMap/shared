import { Issue } from '@entities/issues/issue.entity';
import {
  Entity,
  Index,
  OneToOne,
  type Opt,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({
  tableName: 'issue_layouts',
})
@Index({
  name: 'idx_issue_layouts_component',
  properties: ['componentId'],
})
@Index({
  name: 'idx_issue_layouts_community',
  properties: ['communityId'],
})
@Index({
  name: 'idx_issue_layouts_bbox',
  expression:
    'create index "idx_issue_layouts_bbox" on "issue_layouts" using gist (point(x, y))',
})
export class IssueLayout {
  @OneToOne(() => Issue, {
    name: 'issue',
    nullable: false,
    deleteRule: 'cascade',
    primary: true,
    owner: true,
  })
  readonly issue!: Ref<Issue>;

  @Property({
    name: 'x',
    type: 'double precision',
    nullable: false,
  })
  x!: number;

  @Property({
    name: 'y',
    type: 'double precision',
    nullable: false,
  })
  y!: number;

  @Property({
    name: 'community_id',
    type: 'int',
    nullable: false,
  })
  communityId!: number;

  @Property({
    name: 'component_id',
    type: 'int',
    nullable: false,
  })
  componentId!: number;

  @Property({
    name: 'computed_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
  })
  computedAt: Opt<Date> = new Date();
}
