import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = process.env.LOG_DIR ?? path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: 'web' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ colors: { error: 'red', warn: 'yellow', info: 'green' } }),
        format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`),
      ),
    }),
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3,
      tailable: true,
    }),
  ],
});
