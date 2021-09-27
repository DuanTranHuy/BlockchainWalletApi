import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { TxDto } from '../dto/tx.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('bitcoin')
@ApiTags('Bitcoin')
export class BitcoinController {
  constructor(
    private readonly bitcoinService: BitcoinService,
  ) { }
  @Get('/:testnet/address/:mnemonic/:index')
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.bitcoinService.getAddress(mnemonic, index, testnet);
  }

  @Get('/:testnet/:address/balance')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.bitcoinService.getBalance(address, testnet);
  }

  @Get('/:testnet/:address/transactions')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.bitcoinService.getTransactionsByAddress(address, testnet);
  }

  @Post('/:testnet/broadcast/:signedTx')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.bitcoinService.broadcast(signedTx, testnet);
  }

  @Post('/:testnet/transaction')
  async send(@Body() transaction: TxDto, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.bitcoinService.sendCoin(transaction, testnet);
  }
}
