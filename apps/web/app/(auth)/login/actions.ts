'use server';

import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { formatApiError, isHttpError, type ApiError } from '@repo/api-client';
import { getMonitorClient } from '@/lib/clients/monitor.client';
import { createAuthClient } from '@/lib/clients/auth.client';
import type { UserDto } from '@/lib/clients/users.client';
import { logger } from '@/lib/logger';

type LoginSuccess = { success: true; user: UserDto };
type LoginFailure = { success: false; error: string; status?: number };
export type LoginResult = LoginSuccess | LoginFailure;

export async function loginUserAction(data: { email: string }): Promise<LoginResult> {
    logger.info('loginUserAction: start', { email: data.email });

    const auth = createAuthClient(getMonitorClient());
    const result = await auth.login(data)();

    return pipe(
        result,
        E.fold<ApiError, UserDto, LoginResult>(
            (err) => {
                logger.error('loginUserAction: failed', {
                    email: data.email,
                    tag: err._tag,
                    ...(isHttpError(err) ? { status: err.status } : {}),
                    message: err.message,
                });
                return {
                    success: false,
                    error: isHttpError(err) && err.status === 404
                        ? 'No account found with that email.'
                        : formatApiError(err),
                    ...(isHttpError(err) ? { status: err.status } : {}),
                };
            },
            (user) => {
                logger.info('loginUserAction: success', { userId: user.id, email: user.email });
                return { success: true, user };
            }
        )
    );
}
