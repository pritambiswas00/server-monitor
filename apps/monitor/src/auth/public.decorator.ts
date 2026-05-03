import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Mark a controller or route as public — skips the AuthGuard. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
