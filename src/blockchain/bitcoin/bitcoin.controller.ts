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
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: string): Promise<string> {
    return await this.bitcoinService.getAddress(mnemonic, index, testnet === 'true');
  }

  @Get('/:testnet/:address/balance')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: string): Promise<string> {
    return await this.bitcoinService.getBalance(address, testnet === 'true');
  }

  @Get('/:testnet/:address/transactions')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: string): Promise<any> {
    return await this.bitcoinService.getTransactionsByAddress(address, testnet === 'true');
  }

  @Post('/:testnet/broadcast/:signedTx')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: string): Promise<string> {
    return await this.bitcoinService.broadcast(signedTx, testnet === 'true');
  }

  @Post('/:testnet/transaction')
  async send(@Body() transaction: TxDto, @Param('testnet') testnet: string): Promise<string> {
    return await this.bitcoinService.sendCoin(transaction, testnet === 'true');
  }
}
