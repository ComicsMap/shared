import * as Schemas from '@schemas/sessions.schemas';
import { z } from 'zod';

export type CreateSessionData = z.infer<typeof Schemas.createSessionDataSchema>;
export type CreateSessionResponse = z.infer<
  typeof Schemas.createSessionResponseSchema
>;

export type DeleteSessionResponse = void;
