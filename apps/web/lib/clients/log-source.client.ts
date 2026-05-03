import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import type { HttpClient, ApiError } from '@repo/api-client';
import { FptsOptionString } from './codecs';

export const LogSourceCodec = t.type({
    id:             t.string,
    name:           t.string,
    description:    FptsOptionString,
    status:         t.keyof({ ONLINE: null, OFFLINE: null, UNKNOWN: null }),
    type:           t.keyof({ PROMETHEUS: null, FLUENT_BIT: null }),
    remoteServerId: t.string,
    createdAt:      t.string,
    updatedAt:      t.string,
});

export const LogSourceArrayCodec = t.array(LogSourceCodec);

export type LogSourceDto = t.TypeOf<typeof LogSourceCodec>;

export const createLogSourceClient = (http: HttpClient) => ({
    findAll: (): TE.TaskEither<ApiError, LogSourceDto[]> =>
        http.getDecoded('/log-source', LogSourceArrayCodec),
});

export type LogSourceClient = ReturnType<typeof createLogSourceClient>;
