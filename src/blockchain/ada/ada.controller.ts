import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TxDto } from '../dto/tx.dto';
import { AdaService } from './ada.service';

@Controller('ada')
@ApiTags('Cardano')
export class AdaController {
  constructor(private readonly adaService: AdaService) {}

  @Get('/:testnet/address/:mnemonic/:index')
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: string): Promise<string> {
    return await this.adaService.getAddress(mnemonic, index, testnet === 'true');
  }

  @Get('/:testnet/:address/balance')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: string): Promise<string> {
    return await this.adaService.getBalance(address, testnet === 'true');
  }

  @Get('/:testnet/:address/transactions')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: string): Promise<any> {
    return await this.adaService.getTransactionsByAddress(address, testnet === 'true');
  }

  @Post('/:testnet/broadcast/:signedTx')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: string): Promise<string> {
    return await this.adaService.broadcast(signedTx, testnet === 'true');
  }

  @Post('/:testnet/transaction')
  async Send(@Body() transaction: TxDto, @Param('testnet') testnet: string): Promise<string> {
    return await this.adaService.sendCoin(transaction, testnet === 'true');
  }
}
