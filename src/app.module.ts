import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './app.config.services';
import { AppController } from './app.controller';
import { AdaModule } from './blockchain/ada/ada.module';
import { BitcoinModule } from './blockchain/bitcoin/bitcoin.module';
import { LitecoinModule } from './blockchain/litecoin/litecoin.module';
import { RippleModule } from './blockchain/ripple/ripple.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AdaModule,
    BitcoinModule,
    LitecoinModule,
    RippleModule,
  ],
  controllers: [AppController],
  providers: [ApiConfigService],
})
export class AppModule { }
