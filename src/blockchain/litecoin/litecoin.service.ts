import { Injectable } from '@nestjs/common';
import {Decimal} from 'decimal.js';
import {
    generateLtcWallet,
    generatePrivateKeyFromMnemonic,
    Currency,
    generateAddressFromXPub,
    ltcGetTxForAccount,
    FromAddress,
    To,
    LtcTx,
    ltcGetBalance,
    sendLitecoinTransaction,
    ltcBroadcast
} from '@tatumio/tatum';
import { TxDto } from '../dto/tx.dto';

@Injectable()
export class LitecoinService {
    async getAddress(mnemonic: string, index: number, testnet: boolean = true) {
        const wallet = await generateLtcWallet(testnet, mnemonic);
        const address = generateAddressFromXPub(Currency.LTC, testnet, wallet.xpub, index);
        return address;
    }

    async getTransactionsByAddress(address: string, testnet: boolean = true): Promise<LtcTx[]> {
        return await ltcGetTxForAccount(address, 5, 0)
    }

    async getBalance(address: string, testnet: boolean = true): Promise<string> {
        let balance =  await ltcGetBalance(address)
        const incoming = new Decimal(balance.incoming)
        const outgoing = new Decimal(balance.outgoing)
        return incoming.minus(outgoing).toString();
    }

    async sendCoin(transaction: TxDto, testnet: boolean = true): Promise<string> {
        const { sender, receiver } = transaction
        const wallet = await generateLtcWallet(testnet, sender.mnemonic);
        var fromAddress = [{
            address: await generateAddressFromXPub(Currency.LTC, testnet, wallet.xpub, sender.index),
            privateKey: await generatePrivateKeyFromMnemonic(Currency.LTC, testnet, sender.mnemonic, sender.index)
        } as FromAddress];
        const fromAddressBalance = await this.getBalance(fromAddress[0].address)
        const changeBalance = (new Decimal(fromAddressBalance)).minus(new Decimal(receiver.value)).minus(new Decimal(0.001)).toNumber()
        var to = [{
            address: receiver.address,
            value: receiver.value
        }, {
            address: fromAddress[0].address,
            value: changeBalance
        }] as To[]
        const transactionHash = await sendLitecoinTransaction(testnet, {
            fromAddress,
            to
        });
        return transactionHash.txId
    }

    async broadcast(signedTx: string, testnet: boolean = true): Promise<string> {
        const result = await ltcBroadcast(signedTx);
        return result.txId;
    }
}
