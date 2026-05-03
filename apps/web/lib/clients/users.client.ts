import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import type { HttpClient, ApiError } from '@repo/api-client';

// ── io-ts codec ──────────────────────────────────────────────────────────────

export const UserCodec = t.type({
    id:        t.string,
    name:      t.string,
    email:     t.string,
    createdAt: t.string,
    updatedAt: t.string,
});

export const UserArrayCodec = t.array(UserCodec);

export type UserDto = t.TypeOf<typeof UserCodec>;

// ── Client ───────────────────────────────────────────────────────────────────

export type CreateUserInput = {
    name: string;
    email: string;
};

export const createUsersClient = (http: HttpClient) => ({
    create: (input: CreateUserInput): TE.TaskEither<ApiError, UserDto> =>
        http.postDecoded('/users', input, UserCodec),

    findAll: (): TE.TaskEither<ApiError, UserDto[]> =>
        http.getDecoded('/users', UserArrayCodec),

    findOne: (id: string): TE.TaskEither<ApiError, UserDto> =>
        http.getDecoded(`/users/${id}`, UserCodec),
});

export type UsersClient = ReturnType<typeof createUsersClient>;
