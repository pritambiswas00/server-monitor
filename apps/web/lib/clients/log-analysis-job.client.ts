import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import type { HttpClient, ApiError } from '@repo/api-client';
import { FptsOptionString } from './codecs';

export const LogAnalysisJobCodec = t.type({
    id:             t.string,
    name:           t.string,
    description:    FptsOptionString,
    status:         t.keyof({ INITIALIZED: null, PENDING: null, RUNNING: null, COMPLETED: null, FAILED: null }),
    logSourceId:    t.string,
    remoteServerId: t.string,
    createdAt:      t.string,
    updatedAt:      t.string,
});

export const LogAnalysisJobArrayCodec = t.array(LogAnalysisJobCodec);

export type LogAnalysisJobDto = t.TypeOf<typeof LogAnalysisJobCodec>;

export const ACTIVE_STATUSES = new Set(['INITIALIZED', 'PENDING', 'RUNNING'] as const);

export const createLogAnalysisJobClient = (http: HttpClient) => ({
    findAll: (): TE.TaskEither<ApiError, LogAnalysisJobDto[]> =>
        http.getDecoded('/log-analysis-job', LogAnalysisJobArrayCodec),
});

export type LogAnalysisJobClient = ReturnType<typeof createLogAnalysisJobClient>;
