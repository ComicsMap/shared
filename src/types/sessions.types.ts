import * as Schemas from '@schemas/sessions.schemas';
import { z } from 'zod';

export type SessionID = 'current' | (string & {});

export type CreateSessionData = z.infer<typeof Schemas.createSessionDataSchema>;
export type CreateSessionResponse = z.infer<
  typeof Schemas.createSessionResponseSchema
>;

export type RetrieveSessionResponse = z.infer<
  typeof Schemas.retrieveSessionResponseSchema
>;

export type DeleteSessionResponse = void;
