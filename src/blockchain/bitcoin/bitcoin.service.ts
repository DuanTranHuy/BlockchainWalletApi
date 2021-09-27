import { Injectable } from '@nestjs/common';
import {Decimal} from 'decimal.js';
import {
    generateBtcWallet,
    generatePrivateKeyFromMnemonic,
    Currency,
    generateAddressFromXPub,
    btcGetBalance,
    btcGetTxForAccount,
    btcBroadcast,
    sendBitcoinTransaction,
    FromAddress,
    To,
    BtcTx
} from '@tatumio/tatum';
import { BalanceDto } from '../dto/balance.dto';
import { TxDto } from '../dto/tx.dto';
@Injectable()
export class BitcoinService {

    async getAddress(mnemonic: string, index: number, testnet: boolean = true): Promise<string> {
        const wallet = await generateBtcWallet(testnet, mnemonic);
        const address = generateAddressFromXPub(Currency.BTC, testnet, wallet.xpub, index);
        return address as string;
    }

    async getTransactionsByAddress(address: string, testnet: boolean = true): Promise<BtcTx[]> {
        return await btcGetTxForAccount(address, 5, 0)
    }

    async getBalance(address: string, testnet: boolean = true): Promise<string> {
        let balance =  await btcGetBalance(address) as BalanceDto;
        const incoming = new Decimal(balance.incoming)
        const outgoing = new Decimal(balance.outgoing)
        return incoming.minus(outgoing).toString();
    }

    async sendCoin(transaction: TxDto, testnet: boolean = true): Promise<string> {
        const { sender, receiver } = transaction
        const wallet = await generateBtcWallet(testnet, sender.mnemonic);
        var fromAddress = [{
            address: generateAddressFromXPub(Currency.BTC, testnet, wallet.xpub, sender.index),
            privateKey: await generatePrivateKeyFromMnemonic(Currency.BTC, testnet, wallet.xpub, sender.index)
        } as FromAddress];
        var to = [{
            address: receiver.address,
            value: receiver.value
        } as To]
        const transactionHash = await sendBitcoinTransaction(testnet, {
            fromAddress,
            to
        });
        return transactionHash.txId
    }

    async broadcast(signedTx: string, testnet: boolean = true): Promise<string> {
        const result = await btcBroadcast(signedTx);
        return result.txId;
    }
}
