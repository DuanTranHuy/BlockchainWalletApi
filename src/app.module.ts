import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './app.config.services';
import { AppController } from './app.controller';
import { BitcoinModule } from './blockchain/bitcoin/bitcoin.module';
import { LitecoinModule } from './blockchain/litecoin/litecoin.module';
import { RippleModule } from './blockchain/ripple/ripple.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    BitcoinModule,
    LitecoinModule,
    RippleModule,
  ],
  controllers: [AppController],
  providers: [ApiConfigService],
})
export class AppModule { }
