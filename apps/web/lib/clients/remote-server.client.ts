import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import type { HttpClient, ApiError } from '@repo/api-client';
import { FptsOptionString } from './codecs';

export const RemoteServerCodec = t.type({
    id:          t.string,
    name:        t.string,
    description: FptsOptionString,
    status:      t.keyof({ ONLINE: null, OFFLINE: null, UNKNOWN: null }),
    createdAt:   t.string,
    updatedAt:   t.string,
});

export const RemoteServerArrayCodec = t.array(RemoteServerCodec);

export type RemoteServerDto = t.TypeOf<typeof RemoteServerCodec>;

export const createRemoteServerClient = (http: HttpClient) => ({
    findAll: (): TE.TaskEither<ApiError, RemoteServerDto[]> =>
        http.getDecoded('/remote-server', RemoteServerArrayCodec),
});

export type RemoteServerClient = ReturnType<typeof createRemoteServerClient>;
