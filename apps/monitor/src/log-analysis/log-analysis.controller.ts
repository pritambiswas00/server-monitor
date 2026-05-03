import { Body, Controller, Post } from '@nestjs/common';

export type IngestLogEntry = {
  timestamp: string;
  log: string;
  hostname: string;
  source: string;
  env: string;
};

export type MetricsEntry = {
  timestamp: string;
  hostname: string;
  source: string;
  // CPU fields from Fluent Bit cpu plugin
  cpu_p?: number;     // total CPU usage %
  user_p?: number;    // user space %
  system_p?: number;  // kernel space %
  // Memory fields from Fluent Bit mem plugin
  Mem_total?: number;
  Mem_used?: number;
  Mem_free?: number;
  Swap_total?: number;
  Swap_used?: number;
  Swap_free?: number;
};

@Controller('log-analysis')
export class LogAnalysisController {

    @Post('ingest')
    ingest(@Body() body: IngestLogEntry[]) {
        console.log('Received log entries:', JSON.stringify(body, null, 2));
    }

    @Post('metrics')
    metrics(@Body() body: MetricsEntry[]) {
        console.log('Received host metrics:', JSON.stringify(body, null, 2));
    }
}
