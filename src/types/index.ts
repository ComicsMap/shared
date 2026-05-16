declare global {
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type Nullish<T> = T | null | undefined;
}

export * from '@/types/sessions.types';
export * from '@/types/users.types';
