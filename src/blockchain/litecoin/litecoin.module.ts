import { Module } from '@nestjs/common';
import { LitecoinService } from './litecoin.service';
import { LitecoinController } from './litecoin.controller';

@Module({
  controllers: [LitecoinController],
  providers: [LitecoinService]
})
export class LitecoinModule {}
