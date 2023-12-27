import { User } from '@prisma/client';

export const dynamic = 'force-dynamic';

export type SafeUser = Omit<
  User,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & { createdAt: string; updatedAt: string; emailVerified: string | null };
