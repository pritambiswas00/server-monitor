import * as TE from 'fp-ts/TaskEither';
import type { HttpClient, ApiError } from '@repo/api-client';
import { UserCodec, type UserDto } from './users.client';

export type LoginInput = {
    email: string;
};

export const createAuthClient = (http: HttpClient) => ({
    login: (input: LoginInput): TE.TaskEither<ApiError, UserDto> =>
        http.postDecoded('/auth/login', input, UserCodec),
});

export type AuthClient = ReturnType<typeof createAuthClient>;
