import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TxDto } from '../dto/tx.dto';
import { LitecoinService } from './litecoin.service';

@Controller('litecoin')
@ApiTags('litecoin')
export class LitecoinController {
  logger: Logger;
  constructor(private readonly litecoinService: LitecoinService,
  ) {
    this.logger = new Logger(LitecoinController.name)
  }

  @Get('/:testnet/address/:mnemonic/:index')
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: boolean): Promise<string> {
    this.logger.log(12312312312)
    return '123';
    return await this.litecoinService.getAddress(mnemonic, index, testnet);
  }

  @Get('/:testnet/:address/balance')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.getBalance(address, testnet);
  }

  @Get('/:testnet/:address/transactions')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.getTransactionsByAddress(address, testnet);
  }

  @Post('/:testnet/broadcast/:signedTx')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.broadcast(signedTx, testnet);
  }

  @Post('/:testnet/transaction')
  async sendBitcoin(@Body() transaction: TxDto, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.litecoinService.sendCoin(transaction, testnet);
  }
}
