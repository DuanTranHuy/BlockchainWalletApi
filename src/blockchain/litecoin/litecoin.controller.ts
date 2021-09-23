import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TxDto } from '../dto/tx.dto';
import { LitecoinService } from './litecoin.service';

@Controller('litecoin')
@ApiTags('litecoin')
export class LitecoinController {
  constructor(private readonly litecoinService: LitecoinService) {}

  @Get('address/:mnemonic/:index/:testnet')
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.litecoinService.getAddress(mnemonic, index, testnet);
  }

  @Get('/:address/balance/:testnet')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.getBalance(address, testnet);
  }

  @Get('/:address/transactions/:testnet')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.getTransactionsByAddress(address, testnet);
  }

  @Post('/:signedTx/:testnet')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.broadcast(signedTx, testnet);
  }

  @Post('transaction/:testnet')
  async sendBitcoin(@Body() transaction: TxDto, @Param('testnet') testnet: boolean): Promise<any> {
    console.log(0)
    return await this.litecoinService.sendCoin(transaction, testnet);
  }
}
