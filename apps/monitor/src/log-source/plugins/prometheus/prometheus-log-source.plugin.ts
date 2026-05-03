import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LogSourceType } from '../../entities/log-source.entity';
import { IPullLogSourcePlugin } from '../log-source-plugin.interface';
import { PrometheusLogSourceConfig } from './prometheus-log-source-config.dto';

@Injectable()
export class PrometheusLogSourcePlugin implements IPullLogSourcePlugin {
    readonly type = LogSourceType.PROMETHEUS;
    readonly mode = 'pull' as const;

    validateConfig(raw: unknown): Record<string, unknown> {
        const instance = plainToInstance(PrometheusLogSourceConfig, raw ?? {});
        const errors = validateSync(instance);
        if (errors.length > 0) {
            const messages = errors
                .map((e) => Object.values(e.constraints ?? {}).join(', '))
                .join('; ');
            throw new BadRequestException(`Invalid Prometheus log source config: ${messages}`);
        }
        return instance as unknown as Record<string, unknown>;
    }

    async collect(config: Record<string, unknown>): Promise<Record<string, unknown>[]> {
        const { scrapeUrl, authToken } = config as unknown as PrometheusLogSourceConfig;
        const headers: Record<string, string> = { Accept: 'text/plain' };
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(scrapeUrl, { headers });
        if (!response.ok) {
            throw new Error(`Prometheus scrape failed: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        // Parse Prometheus text exposition format into structured records
        return this.parsePrometheusTextFormat(text);
    }

    private parsePrometheusTextFormat(text: string): Record<string, unknown>[] {
        const records: Record<string, unknown>[] = [];
        for (const line of text.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            // e.g. http_requests_total{method="GET",status="200"} 1234 1712345678000
            const match = trimmed.match(/^([^{}\s]+)(\{[^}]*\})?\s+([\d.e+\-NaInf]+)(?:\s+(\d+))?/);
            if (!match) continue;

            const [, metricName, labelsRaw, valueStr, timestampStr] = match;
            if (!valueStr) continue;
            const labels: Record<string, string> = {};
            if (labelsRaw) {
                for (const pair of labelsRaw.slice(1, -1).split(',')) {
                    const [k, v] = pair.split('=');
                    if (k && v) labels[k.trim()] = v.replace(/"/g, '').trim();
                }
            }

            records.push({
                metric: metricName,
                labels,
                value: parseFloat(valueStr),
                timestamp: timestampStr ? parseInt(timestampStr, 10) : Date.now(),
            });
        }
        return records;
    }
}
