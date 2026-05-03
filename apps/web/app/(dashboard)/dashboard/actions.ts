'use server';

import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { formatApiError, type ApiError } from '@repo/api-client';
import { getMonitorClient } from '@/lib/clients/monitor.client';
import { createRemoteServerClient, type RemoteServerDto } from '@/lib/clients/remote-server.client';
import { createLogSourceClient, type LogSourceDto } from '@/lib/clients/log-source.client';
import { createLogAnalysisJobClient, type LogAnalysisJobDto, ACTIVE_STATUSES } from '@/lib/clients/log-analysis-job.client';
import { logger } from '@/lib/logger';

export type DashboardData = {
    remoteServers: RemoteServerDto[];
    logSources: LogSourceDto[];
    activeJobs: LogAnalysisJobDto[];
};

type DashboardResult =
    | { success: true; data: DashboardData }
    | { success: false; error: string };

export async function getDashboardDataAction(): Promise<DashboardResult> {
    logger.info('getDashboardDataAction: start');

    const http = getMonitorClient();
    const remoteServerClient = createRemoteServerClient(http);
    const logSourceClient = createLogSourceClient(http);
    const jobClient = createLogAnalysisJobClient(http);

    const combined = pipe(
        TE.Do,
        TE.bind('remoteServers', () => remoteServerClient.findAll()),
        TE.bind('logSources',    () => logSourceClient.findAll()),
        TE.bind('allJobs',       () => jobClient.findAll()),
    );

    const result = await combined();

    return pipe(
        result,
        E.fold<ApiError, { remoteServers: RemoteServerDto[]; logSources: LogSourceDto[]; allJobs: LogAnalysisJobDto[] }, DashboardResult>(
            (err): DashboardResult => {
                logger.error('getDashboardDataAction: failed', { tag: err._tag, message: err.message });
                return { success: false, error: formatApiError(err) };
            },
            ({ remoteServers, logSources, allJobs }): DashboardResult => {
                const activeJobs = allJobs.filter((j) => ACTIVE_STATUSES.has(j.status as any));
                logger.info('getDashboardDataAction: success', {
                    remoteServers: remoteServers.length,
                    logSources: logSources.length,
                    activeJobs: activeJobs.length,
                });
                return { success: true, data: { remoteServers, logSources, activeJobs } };
            }
        )
    );
}
