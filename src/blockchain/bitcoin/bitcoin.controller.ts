import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { TxDto } from '../dto/tx.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('bitcoin')
@ApiTags('bitcoin')
export class BitcoinController {
  constructor(
    private readonly bitcoinService: BitcoinService,
  ) { }
  @Get('address/:mnemonic/:index/:testnet')
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.bitcoinService.getAddress(mnemonic, index, testnet);
  }

  @Get('/:address/balance/:testnet')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.bitcoinService.getBalance(address, testnet);
  }

  @Get('/:address/transactions/:testnet')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.bitcoinService.getTransactionsByAddress(address, testnet);
  }

  @Post('/:signedTx/:testnet')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.bitcoinService.broadcast(signedTx, testnet);
  }

  @Post('transaction/:testnet')
  async sendBitcoin(@Body() transaction: TxDto, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.bitcoinService.sendCoin(transaction, testnet);
  }
}
