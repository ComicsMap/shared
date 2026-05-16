import { Cover } from '@entities/issues/cover.entity';
import { Issue } from '@entities/issues/issue.entity';
import { Person } from '@entities/person.entity';
import {
  BeforeCreate,
  BeforeUpdate,
  Check,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Unique,
  ValidationError,
  type Ref,
} from '@mikro-orm/core';

export enum ContributorRole {
  Writer = 'WRITER',
  Artist = 'ARTIST',
  CoverArtist = 'COVER_ARTIST',
}

@Entity({
  tableName: 'issue_contributors',
})
// Ensure that if the role is COVER_ARTIST, then cover_uuid must be provided.
@Check({
  name: 'chk_cover_artist_requires_cover',
  expression: (columns) =>
    `${columns['role']} != 'COVER_ARTIST' OR cover_uuid IS NOT NULL`,
})
// Ensure that if cover_uuid is provided, then the role must be COVER_ARTIST.
@Check({
  name: 'chk_cover_requires_cover_artist_role',
  expression: (columns) =>
    `cover_uuid IS NULL OR ${columns['role']} = 'COVER_ARTIST'`,
})
@Unique({
  name: 'uq_issue_contributor',
  properties: ['issue', 'person', 'role', 'cover'],
  options: {
    nulls: 'not distinct',
  },
})
export class IssueContributor {
  @PrimaryKey({
    name: 'uuid',
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  readonly uuid: string = crypto.randomUUID();

  @ManyToOne(() => Issue, {
    name: 'issue_uuid',
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly issue!: Ref<Issue>;

  @ManyToOne(() => Person, {
    name: 'person_uuid',
    nullable: false,
    deleteRule: 'cascade',
  })
  readonly person!: Ref<Person>;

  @ManyToOne(() => Cover, {
    name: 'cover_uuid',
    nullable: true,
    deleteRule: 'cascade',
  })
  cover?: Ref<Cover>;

  @Enum({
    name: 'role',
    items: () => ContributorRole,
    nativeEnumName: 'contributor_role',
    nullable: false,
  })
  role!: ContributorRole;

  @BeforeCreate()
  @BeforeUpdate()
  validateCoverConsistency() {
    if (this.role === ContributorRole.CoverArtist && !this.cover) {
      throw new ValidationError(
        'A contributor with role COVER_ARTIST must have a cover.',
      );
    }
    if (this.role !== ContributorRole.CoverArtist && this.cover) {
      throw new ValidationError(
        'A contributor with a cover must have the role COVER_ARTIST.',
      );
    }
  }
}
