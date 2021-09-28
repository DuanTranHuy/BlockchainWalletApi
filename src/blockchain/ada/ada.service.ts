import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { AdaAccount, adaBroadcast, adaGetAccountsByAddress, adaGetTransactionsByAccount, Currency, FromAddress, generateAdaWallet, generateAddressFromXPub, generatePrivateKeyFromMnemonic, prepareAdaTransaction, sendAdaTransaction, To } from '@tatumio/tatum';
import { TxDto } from '../dto/tx.dto';

@Injectable()
export class AdaService {
    async getAddress(mnemonic: string, index: number, testnet: boolean = true) {
        console.log(mnemonic);
        const wallet = await generateAdaWallet(mnemonic);
        const address = generateAddressFromXPub(Currency.ADA, testnet, wallet.xpub, Number(index));
        return address;
    }

    async getTransactionsByAddress(address: string, testnet: boolean = true): Promise<any> {
        return await adaGetTransactionsByAccount(address, 5, 0)
    }

    async getBalance(address: string, testnet: boolean = true): Promise<string> {
        let balance = await adaGetAccountsByAddress(address) as any;
        const account = balance.summary as AdaAccount;
        const adaAsset = account.assetBalances.find(x => x.asset.assetId === 'ada');
        return adaAsset ? (new Decimal(adaAsset.quantity)).div(Decimal.pow(10, 6)).toString() : '0'
    }

    async sendCoin(transaction: TxDto, testnet: boolean = true): Promise<any> {
        const { sender, receiver } = transaction
        const wallet = await generateAdaWallet(sender.mnemonic);
        var fromAddress = [{
            address: await generateAddressFromXPub(Currency.ADA, testnet, wallet.xpub, Number(sender.index)),
            privateKey: await generatePrivateKeyFromMnemonic(Currency.ADA, testnet, sender.mnemonic, Number(sender.index))
        } as FromAddress];
        var to = [{
            address: receiver.address,
            value: receiver.value
        } as To]
        const transactionHash = await sendAdaTransaction({
            fromAddress,
            to
        });
        return transactionHash.txId;
    }

    async broadcast(signedTx: string, testnet: boolean = true): Promise<string> {
        const result = await adaBroadcast(signedTx);
        return result.txId;
    }

}
