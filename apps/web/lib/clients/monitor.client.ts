import { createHttpClient, type HttpClient } from '@repo/api-client';

/**
 * Singleton HTTP client pointed at the NestJS monitor.
 * Only use this on the server (server actions, route handlers).
 * Config is read from env vars at call time — no module-level caching needed in Next.js.
 */
export const getMonitorClient = (): HttpClient => {
    const protocol = process.env.MONITOR_PROTOCOL ?? 'http';
    const host = process.env.MONITOR_HOST ?? 'localhost';
    const port = process.env.MONITOR_PORT ?? '4000';

    return createHttpClient({ baseUrl: `${protocol}://${host}:${port}` });
};
