'use server';

import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { formatApiError, isHttpError, type ApiError } from '@repo/api-client';
import { getMonitorClient } from '@/lib/clients/monitor.client';
import { createUsersClient, type UserDto } from '@/lib/clients/users.client';
import { logger } from '@/lib/logger';

type RegisterSuccess = { success: true; user: UserDto };
type RegisterFailure = { success: false; error: string; status?: number };
export type RegisterResult = RegisterSuccess | RegisterFailure;

export async function registerUserAction(data: {
    name: string;
    email: string;
}): Promise<RegisterResult> {
    logger.info('registerUserAction: start', { email: data.email });

    const users = createUsersClient(getMonitorClient());
    const result = await users.create(data)();

    return pipe(
        result,
        E.fold<ApiError, UserDto, RegisterResult>(
            (err): RegisterFailure => {
                logger.error('registerUserAction: failed', {
                    email: data.email,
                    tag: err._tag,
                    ...(isHttpError(err) ? { status: err.status, code: err.code } : {}),
                    message: err.message,
                });
                return {
                    success: false,
                    error: formatApiError(err),
                    ...(isHttpError(err) ? { status: err.status } : {}),
                };
            },
            (user): RegisterSuccess => {
                logger.info('registerUserAction: success', { userId: user.id, email: user.email });
                return { success: true, user };
            }
        )
    );
}
