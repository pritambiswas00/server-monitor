import { type NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const logFile = path.join(process.env.LOG_DIR ?? path.join(process.cwd(), 'logs'), 'app.log');

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lines = Math.min(parseInt(searchParams.get('lines') ?? '100', 10), 1000);
  const level = searchParams.get('level');

  if (!fs.existsSync(logFile)) {
    return NextResponse.json({ logs: [], message: 'Log file not yet created — server may still be warming up.' });
  }

  try {
    const content = fs.readFileSync(logFile, 'utf-8');

    let entries = content
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as Record<string, unknown>;
        } catch {
          return { message: line, level: 'info' };
        }
      });

    if (level) {
      entries = entries.filter((e) => e.level === level);
    }

    return NextResponse.json({ logs: entries.slice(-lines), total: entries.length });
  } catch {
    return NextResponse.json({ error: 'Failed to read log file' }, { status: 500 });
  }
}
