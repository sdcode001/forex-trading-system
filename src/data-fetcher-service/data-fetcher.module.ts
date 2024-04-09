import { Module } from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';

@Module({
  providers: [DataFetcherService],
})
export class DataFetcherModule {}
