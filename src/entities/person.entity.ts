import * as Constants from '@constants/people.constants';
import { AuditableEntity } from '@entities/auditable.entity';
import { IssueContributor } from '@entities/issues/issue-contributor.entity';
import {
  BeforeCreate,
  BeforeUpdate,
  Check,
  Collection,
  Entity,
  OneToMany,
  type Opt,
  Property,
} from '@mikro-orm/core';

@Entity({
  tableName: 'people',
})
@Check({
  name: 'people_identity_check',
  expression:
    'pseudonym IS NOT NULL OR (first_name IS NOT NULL AND last_name IS NOT NULL)',
})
export class Person extends AuditableEntity {
  @Property({
    name: 'first_name',
    type: 'varchar',
    length: Constants.FIRST_NAME_MAX_LENGTH,
    nullable: true,
  })
  firstName?: Opt<string>;

  @Property({
    name: 'last_name',
    type: 'varchar',
    length: Constants.LAST_NAME_MAX_LENGTH,
    nullable: true,
  })
  lastName?: Opt<string>;

  @Property({
    name: 'pseudonym',
    type: 'varchar',
    length: Constants.PSEUDONYM_MAX_LENGTH,
    nullable: true,
  })
  pseudonym?: Opt<string>;

  @Property({ persist: false })
  get displayName(): Opt<string> {
    return Person.formatDisplayName(
      this.firstName,
      this.lastName,
      this.pseudonym,
    ) as string;
  }

  @OneToMany(() => IssueContributor, (contribution) => contribution.person)
  readonly contributions = new Collection<IssueContributor>(this);

  @BeforeCreate()
  @BeforeUpdate()
  validateIdentity() {
    if (!this.pseudonym && (!this.firstName || !this.lastName)) {
      throw new Error(
        'A person must have either a pseudonym or both a first name and a last name.',
      );
    }
  }

  public static formatDisplayName(
    firstName?: string,
    lastName?: string,
    pseudonym?: string,
  ): Nullable<string> {
    if (pseudonym) return pseudonym;
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    return fullName || null;
  }
}
