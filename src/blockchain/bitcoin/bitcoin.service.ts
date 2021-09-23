import { Injectable } from '@nestjs/common';
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
    FromUTXO,
    BtcTx
} from '@tatumio/tatum';
import { BalanceDto } from '../dto/balance.dto';
import { TxDto } from '../dto/tx.dto';
@Injectable()
export class BitcoinService {

    async getAddress(mnemonic: string, index: number, testnet: boolean = true) {
        const wallet = await generateBtcWallet(testnet, mnemonic);
        const address = generateAddressFromXPub(Currency.BTC, testnet, wallet.xpub, index);
        return address;
    }

    async getTransactionsByAddress(address: string, testnet: boolean = true): Promise<BtcTx[]> {
        return await btcGetTxForAccount(address, 5, 0)
    }

    async getBalance(address: string, testnet: boolean = true): Promise<BalanceDto> {
        return await btcGetBalance(address) as BalanceDto;
    }

    async sendCoin(transaction: TxDto, testnet: boolean = true) {
        const { senders, receivers } = transaction
        var fromAddress = await Promise.all(senders.map(async (sender) => {
            const wallet = await generateBtcWallet(testnet, sender.mnemonic);
            return {
                address: generateAddressFromXPub(Currency.BTC, testnet, wallet.xpub, sender.index),
                privateKey: await generatePrivateKeyFromMnemonic(Currency.BTC, testnet, wallet.xpub, sender.index)
            } as FromAddress;
        }))
        var to = receivers.map(receiver => {
            return {
                address: receiver.address,
                value: receiver.value
            } as To
        })
        return await sendBitcoinTransaction(testnet, {
            fromAddress,
            to
        });
    }

    async sendCoinFromUTXOS(fromUTXOS: any[], receivers: any[], testnet: boolean = true) {
        var fromUTXO = await Promise.all(fromUTXOS.map(async (fromUTXO) => {
            const wallet = await generateBtcWallet(testnet, fromUTXO.mnemonic);
            return {
                txHash: fromUTXO.txid,
                index: fromUTXO.index,
                privateKey: await generatePrivateKeyFromMnemonic(Currency.BTC, testnet, wallet.xpub, fromUTXO.index)
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
        const result = await btcBroadcast(signedTx);
        return result.txId;
    }
}
