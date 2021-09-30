import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TxDto } from '../dto/tx.dto';
import { LitecoinService } from './litecoin.service';

@Controller('litecoin')
@ApiTags('Litecoin')
export class LitecoinController {
  constructor(private readonly litecoinService: LitecoinService,
  ) { }

  @Get('/:testnet/address/:mnemonic/:index')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: string): Promise<string> {
    return await this.litecoinService.getAddress(mnemonic, index, testnet === 'true');
  }

  @Get('/:testnet/:address/balance')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: string): Promise<any> {
    return await this.litecoinService.getBalance(address, testnet === 'true');
  }

  @Get('/:testnet/:address/transactions')
  async getTransactionsByAddress(@Param('address') address: string, @Param('testnet') testnet: string): Promise<any> {
    return await this.litecoinService.getTransactionsByAddress(address, testnet === 'true');
  }

  @Post('/:testnet/broadcast/:signedTx')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: string): Promise<any> {
    return await this.litecoinService.broadcast(signedTx, testnet === 'true');
  }

  @Post('/:testnet/transaction')
  async send(@Body() transaction: TxDto, @Param('testnet') testnet: string): Promise<any> {
    return await this.litecoinService.sendCoin(transaction, testnet === 'true');
  }
}
