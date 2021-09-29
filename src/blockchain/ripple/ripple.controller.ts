import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TxDto } from '../dto/tx.dto';
import { RippleService } from './ripple.service';

@Controller('ripple')
@ApiTags('Ripple')
export class RippleController {
  constructor(private readonly rippleService: RippleService) {}
  @Get('/:testnet/address/:mnemonic/:index')
  async getAddress(@Param('mnemonic') mnemonic: string, @Param('index') index: number, @Param('testnet') testnet: boolean): Promise<string> {
    return await this.rippleService.getAddress(mnemonic, index, testnet);
  }

  @Get('/:testnet/:address/balance')
  async getBalance(@Param('address') address: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.rippleService.getBalance(address, testnet);
  }

  @Get('/:testnet/:address/transactions/:min')
  async getTransactionsByAddress(@Param('address') address: string, @Param('min') min: number, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.rippleService.getTransactionsByAddress(address, min, testnet);
  }

  @Post('/:testnet/broadcast/:signedTx')
  async boradcast(@Param('signedTx') signedTx: string, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.rippleService.broadcast(signedTx, testnet);
  }

  @Post('/:testnet/transaction')
  async send(@Body() transaction: TxDto, @Param('testnet') testnet: boolean): Promise<any> {
    return await this.rippleService.sendCoin(transaction, testnet);
  }
}
