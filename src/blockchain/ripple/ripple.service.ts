import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { TransferXrp, xrpBroadcast, xrpGetAccountBalance, xrpGetAccountInfo } from '@tatumio/tatum';
import { mnemonicToSeed } from "bip39";
import * as bip32 from "ripple-bip32";
import { TxDto } from '../dto/tx.dto';
import sign from 'ripple-sign-keypairs';
import { get } from "@tatumio/tatum/dist/src/connector/tatum";

@Injectable()
export class RippleService {

    async getAddress(mnemonic: string, index: number, testnet: boolean = true): Promise<string> {
        const m = await this.getMasterKey(mnemonic, index)
        return m.getAddress();
    }

    private async getMasterKey(mnemonic: string, index: number): Promise<any> {
        const seed = await mnemonicToSeed(mnemonic)
        return bip32.fromSeedBuffer(seed).derivePath(`m/44'/144'/0'/0/${index}`)
    }

    private async xrpGetAccountInfo(address: string) {
        return await xrpGetAccountInfo(address)
    }

    async getTransactionsByAddress(address: string, min: number, testnet: boolean = true): Promise<any> {
        return await get(`/v3/xrp/account/tx/${address}?min=${min}`)
    }

    async getBalance(address: string, testnet: boolean = true): Promise<string> {
        const accountInfo = await xrpGetAccountBalance(address) as {
            balance: string,
            asset: any[]
        };
        const balance = new Decimal(accountInfo.balance)
        return balance.div(Decimal.pow(10, 6)).toString()
    }

    async sendCoin(transaction: TxDto, testnet: boolean = true): Promise<any> {
        const { sender, receiver } = transaction
        var data = new TransferXrp();
        data.fromAccount = await this.getAddress(sender.mnemonic, sender.index, testnet)
        const m = await this.getMasterKey(sender.mnemonic, sender.index)
        data.fromSecret = m.keyPair.getKeyPairs().privateKey.substring(2)
        data.to = receiver.address
        data.amount = receiver.value.toString()
        const accountInfo = await this.xrpGetAccountInfo(data.fromAccount)
        var tx = {
            TransactionType: 'Payment',
            Account: data.fromAccount,
            Fee: (0.000012 * 1000 * 1000) + '',
            Destination: receiver.address,
            Amount: (receiver.value * 1000 * 1000) + '',
            Sequence: accountInfo.account_data.Sequence
        }
        var txJSON = JSON.stringify(tx)
        var txSign = sign(txJSON, m.keyPair.getKeyPairs())
        const result = await xrpBroadcast(txSign.signedTransaction);
        return result.txId;
    }


    async broadcast(signedTx: string, testnet: boolean = true): Promise<string> {
        const result = await xrpBroadcast(signedTx);
        return result.txId;
    }
}
