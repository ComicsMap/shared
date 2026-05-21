import * as Schemas from '@schemas/users.schemas';
import { z } from 'zod';

export type SerializedUser = z.infer<typeof Schemas.serializedUserSchema>;

/** Create User Types */

export type CreateUserData = z.infer<typeof Schemas.createUserDataSchema>;
export type CreateUserResponse = z.infer<
  typeof Schemas.createUserResponseSchema
>;
