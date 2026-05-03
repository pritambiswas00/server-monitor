import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

/**
 * Config shape for Prometheus pull-based log sources.
 * The monitor polls the scrapeUrl on the configured interval.
 */
export class PrometheusLogSourceConfig {
    @ApiProperty({ type: String, description: 'Prometheus metrics endpoint to scrape, e.g. http://host:9090/metrics' })
    @IsUrl({ require_tld: false }, { message: 'scrapeUrl must be a valid URL' })
    scrapeUrl: string;

    @ApiProperty({ type: Number, description: 'Polling interval in seconds (minimum 5)', default: 30 })
    @IsInt()
    @Min(5, { message: 'intervalSeconds must be at least 5' })
    intervalSeconds: number;

    @ApiProperty({ type: String, required: false, description: 'Optional Bearer token for authenticated Prometheus endpoints' })
    @IsOptional()
    @IsString()
    authToken?: string;

    @ApiProperty({ type: Object, required: false, description: 'Optional label matchers to filter metrics, e.g. { job: "api-server" }' })
    @IsOptional()
    labels?: Record<string, string>;
}
