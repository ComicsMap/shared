import * as Constants from '@constants/users.constants';
import { z } from 'zod';

export const userEntitySchema = z.object({
  uuid: z.uuid().describe('The unique identifier of the user'),
  username: z.string().describe('The username of the user'),
  email: z.email().describe('The email of the user'),
  password: z.string().describe('The password of the user'),
  createdAt: z.date().describe('The date when the user was created'),
  updatedAt: z.date().describe('The date when the user was last updated'),
  deletedAt: z.date().nullish().describe('The date when the user was deleted'),
});

export const serializedUserSchema = userEntitySchema.omit({ password: true });

export const createUserDataSchema = z.object({
  username: z
    .string()
    .min(Constants.USERNAME_MIN_LENGTH)
    .max(Constants.USERNAME_MAX_LENGTH)
    .regex(Constants.USERNAME_REGEX, {
      message: 'Username must only contain letters, numbers and underscores',
    })
    .describe('The username of the user'),
  email: z.email().describe('The email of the user'),
  password: z
    .string()
    .min(Constants.PASSWORD_MIN_LENGTH)
    .max(Constants.PASSWORD_MAX_LENGTH)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    )
    .describe('The password of the user'),
});
export const createUserResponseSchema = serializedUserSchema;
