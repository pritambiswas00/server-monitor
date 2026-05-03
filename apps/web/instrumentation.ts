// Next.js instrumentation — runs once on server startup (Node.js runtime only).
// Generates realistic dummy log entries so the server-monitor app has
// live data to read from the log file inside the Docker container.

type LogScenario = {
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: Record<string, unknown>;
};

const ROUTES = ['/', '/dashboard', '/settings', '/profile', '/api/health'];
const METHODS = ['GET', 'GET', 'GET', 'POST', 'PUT', 'DELETE'];
const USERS = ['usr_a1b2c3', 'usr_d4e5f6', 'usr_g7h8i9', 'usr_j1k2l3'];
const IPS = ['10.0.0.1', '10.0.0.2', '192.168.1.10', '172.17.0.3'];
const JOB_IDS = ['job_x1y2z3', 'job_p4q5r6', 'job_m7n8o9', 'job_a0b1c2'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// These functions exist purely to produce realistic multi-frame stack traces.
function parseRequestBody(raw: string): unknown {
  return JSON.parse(raw);
}
function queryDatabase(query: string): never {
  throw new Error(`ECONNRESET: connection reset by peer — query: ${query}`);
}
function handleRoute(route: string): never {
  throw new TypeError(`Cannot read properties of undefined (reading 'userId') — route: ${route}`);
}

function captureError(fn: () => never): Error {
  try { fn(); } catch (e) { return e as Error; }
  return new Error('unknown');
}

function buildScenario(forceError = false): LogScenario {
  const roll = forceError ? 0 : Math.random();

  // ~5% chance of an error (or always when forceError is true)
  if (roll < 0.05) {
    const errors: LogScenario[] = [
      {
        level: 'error',
        message: 'Unhandled exception in route handler',
        meta: {
          route: pick(ROUTES),
          ownerId: pick(USERS),
          jobId: pick(JOB_IDS),
          stack: captureError(() => handleRoute(pick(ROUTES))).stack,
        },
      },
      {
        level: 'error',
        message: 'Database connection lost',
        meta: {
          code: 'ECONNRESET',
          retryIn: '5s',
          ownerId: pick(USERS),
          jobId: pick(JOB_IDS),
          stack: captureError(() => queryDatabase('SELECT * FROM users')).stack,
        },
      },
      {
        level: 'error',
        message: 'Failed to parse request body',
        meta: {
          route: '/api/data',
          ip: pick(IPS),
          ownerId: pick(USERS),
          jobId: pick(JOB_IDS),
          stack: captureError(() => { parseRequestBody('<html>404 Not Found</html>'); throw new Error(); }).stack,
        },
      },
    ];
    return pick(errors);
  }

  // ~10% chance of a warning
  if (roll < 0.15) {
    const warnings: LogScenario[] = [
      { level: 'warn', message: 'Slow response detected', meta: { route: pick(ROUTES), duration: Math.floor(Math.random() * 1000) + 500 } },
      { level: 'warn', message: 'Rate limit approaching for IP', meta: { ip: pick(IPS), remaining: Math.floor(Math.random() * 10) } },
      { level: 'warn', message: 'JWT token expiring soon', meta: { userId: pick(USERS), expiresIn: '5m' } },
      { level: 'warn', message: 'Cache miss ratio is high', meta: { ratio: (Math.random() * 0.4 + 0.5).toFixed(2) } },
    ];
    return pick(warnings);
  }

  // Remaining ~85% are info logs
  const infos: LogScenario[] = [
    {
      level: 'info',
      message: `${pick(METHODS)} ${pick(ROUTES)} 200`,
      meta: { duration: Math.floor(Math.random() * 150) + 5, ip: pick(IPS), userId: pick(USERS) },
    },
    { level: 'info', message: 'User authenticated', meta: { userId: pick(USERS), ip: pick(IPS) } },
    { level: 'info', message: 'Cache hit', meta: { key: `page:${pick(ROUTES)}`, ttl: Math.floor(Math.random() * 300) } },
    { level: 'info', message: 'Session refreshed', meta: { userId: pick(USERS) } },
    { level: 'info', message: 'Static asset served', meta: { asset: `/_next/static/chunks/main-${Math.random().toString(36).slice(2, 8)}.js` } },
    { level: 'info', message: 'Health check passed', meta: { uptime: process.uptime().toFixed(0) } },
  ];
  return pick(infos);
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('./lib/logger');
    const { errorState } = await import('./lib/error-state');

    logger.info('Next.js server started', {
      port: process.env.PORT ?? 3000,
      nodeEnv: process.env.NODE_ENV,
      logDir: process.env.LOG_DIR ?? 'logs/',
    });

    // Generate a dummy log entry every 3 seconds
    setInterval(() => {
      const { level, message, meta } = errorState.forceErrors
        ? buildScenario(true)
        : buildScenario();
      logger[level](message, meta ?? {});
    }, 3000);
  }
}
