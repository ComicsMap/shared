import { Issue } from '@entities/issues/issue.entity';
import {
  Entity,
  ManyToOne,
  type Opt,
  Property,
  type Ref,
} from '@mikro-orm/core';

@Entity({
  tableName: 'reading_edges',
})
export class ReadingEdge {
  @ManyToOne(() => Issue, {
    name: 'from',
    nullable: false,
    deleteRule: 'cascade',
    primary: true,
  })
  readonly from!: Ref<Issue>;

  @ManyToOne(() => Issue, {
    name: 'to',
    nullable: false,
    deleteRule: 'cascade',
    primary: true,
  })
  readonly to!: Ref<Issue>;

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
    defaultRaw: 'now()',
  })
  readonly createdAt: Opt<Date> = new Date();
}
