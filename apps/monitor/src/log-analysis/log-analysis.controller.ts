import { Body, Controller, Post } from '@nestjs/common';

@Controller('log-analysis')
export class LogAnalysisController {

    @Post('ingest')
    ingest(@Body() body: unknown) {
         console.log('Received log entries:', body);
    }
}
