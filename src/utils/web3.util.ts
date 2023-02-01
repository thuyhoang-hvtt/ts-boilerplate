import * as ethers from 'ethers';
import { base58, verifyMessage } from 'ethers/lib/utils';
import { TextEncoder } from 'node:util';
import * as nacl from 'tweetnacl';

import { ServerWalletConfig } from '@/config';

export default class Web3Util {
  static isAddressEqual(addressI: string, addressII: string) {
    return addressI.toLowerCase() === addressII.toLowerCase();
  }

  static verifyEthereumSignature(message: string, signature: string, owner: string) {
    const address = verifyMessage(message, signature);
    return Web3Util.isAddressEqual(address, owner);
  }

  static verifySolanaSignature(message: string, signature: string, pubkey: string) {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      base58.decode(signature),
      base58.decode(pubkey),
    );
  }

  static verifyAptosSignature(message: string, signature: string, pubkey: string) {
    const key = pubkey.replace('0x', '');
    return nacl.sign.detached.verify(
      Buffer.from(message),
      Buffer.from(signature.replace('0x', ''), 'hex'),
      Buffer.from(key, 'hex'),
    );
  }

  static parseDecimals(value: number | string, decimal = 18): string {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return ethers.utils.parseUnits(value, decimal).toString();
  }

  static getServerSigner(): ethers.Wallet {
    return new ethers.Wallet(ServerWalletConfig.PRIVATE_KEY);
  }

  static async signTypedData(
    data: any,
    types: Record<string, Array<{ name: string; type: string }>>,
    domain = null,
  ): Promise<string> {
    const signer = Web3Util.getServerSigner();
    return await signer._signTypedData(domain, types, data);
  }
}
