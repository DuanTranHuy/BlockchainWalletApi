import { Injectable } from '@nestjs/common';
import {
    generateLtcWallet,
    generatePrivateKeyFromMnemonic,
    Currency,
    generateAddressFromXPub,
    ltcGetTxForAccount,
    sendBitcoinTransaction,
    FromAddress,
    To,
    FromUTXO,
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

    async getBalance(address: string, testnet: boolean = true): Promise<{
        incoming: string;
        outgoing: string;
    }> {
        return await ltcGetBalance(address)
    }

    async sendCoin(transaction: TxDto, testnet: boolean = true) {
        const { senders, receivers } = transaction
        var fromAddress = await Promise.all(senders.map(async (sender) => {
            const wallet = await generateLtcWallet(testnet, sender.mnemonic);
            return {
                address: generateAddressFromXPub(Currency.LTC, testnet, wallet.xpub, sender.index),
                privateKey: await generatePrivateKeyFromMnemonic(Currency.LTC, testnet, wallet.xpub, sender.index)
            } as FromAddress;
        }))
        var to = receivers.map(receiver => {
            return {
                address: receiver.address,
                value: receiver.value
            } as To
        })
        return await sendLitecoinTransaction(testnet, {
            fromAddress,
            to
        });
    }

    async sendCoinFromUTXOS(fromUTXOS: any[], receivers: any[], testnet: boolean = true) {
        var fromUTXO = await Promise.all(fromUTXOS.map(async (fromUTXO) => {
            const wallet = await generateLtcWallet(testnet, fromUTXO.mnemonic);
            return {
                txHash: fromUTXO.txid,
                index: fromUTXO.index,
                privateKey: await generatePrivateKeyFromMnemonic(Currency.LTC, testnet, wallet.xpub, fromUTXO.index)
            } as FromUTXO;
        }))
        var to = receivers.map(receiver => {
            return {
                address: receiver.address,
                value: receiver.value
            } as To
        })
        return await sendBitcoinTransaction(testnet, {
            fromUTXO,
            to
        });
    }

    async broadcast(signedTx: string, testnet: boolean = true): Promise<string> {
        const result = await ltcBroadcast(signedTx);
        return result.txId;
    }
}
