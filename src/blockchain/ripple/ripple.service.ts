import { Injectable } from '@nestjs/common';
import {Decimal} from 'decimal.js';
import { sendXrpTransaction, TransferXrp, xrpBroadcast, xrpGetAccountBalance, xrpGetAccountTransactions } from '@tatumio/tatum';
import {mnemonicToSeed} from "bip39";
import * as bip32 from "ripple-bip32";

@Injectable()
export class RippleService {

    async getAddress(mnemonic: string, index: number, testnet: boolean = true): Promise<string> {
        const seed = await mnemonicToSeed(mnemonic)
        const m = bip32.fromSeedBuffer(seed)
        return m.derivePath(`m/44'/144'/0'/0/${index}`).getAddress();
    }

    async getTransactionsByAddress(address: string, testnet: boolean = true): Promise<any> {
        return await xrpGetAccountTransactions(address)
    }

    async getBalance(address: string, testnet: boolean = true): Promise<string> {
        const accountInfo =  await xrpGetAccountBalance(address) as {
            balance: string,
            asset: any[]
        };
        const balance = new Decimal(accountInfo.balance)
        return balance.div(Decimal.pow(10, 6)).toString()
    }

    async sendCoin(transaction: TransferXrp, testnet: boolean = true): Promise<any> {
        return await sendXrpTransaction(transaction);
    }


    async broadcast(signedTx: string, testnet: boolean = true): Promise<string> {
        const result = await xrpBroadcast(signedTx);
        return result.txId;
    }
}
