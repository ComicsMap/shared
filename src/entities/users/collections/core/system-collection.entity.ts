import { AbstractCollection } from '@entities/users/collections/core/abstract-collection.entity';
import { User } from '@entities/users/user.entity';
import {
  BeforeDelete,
  Entity,
  type EventArgs,
  OneToOne,
  type Ref,
  ValidationError,
} from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class SystemCollection extends AbstractCollection {
  @OneToOne(() => User, {
    name: 'owner_uuid',
    nullable: false,
    deleteRule: 'cascade',
    ref: true,
  })
  declare readonly owner: Ref<User>;

  @BeforeDelete()
  preventDeleteWhileOwnerExists(args: EventArgs<SystemCollection>) {
    const uow = args.em.getUnitOfWork();
    if (!uow.getRemoveStack().has(this.owner.getEntity())) {
      throw new ValidationError(
        'A system collection cannot be deleted while its owner exists.',
      );
    }
  }
}
