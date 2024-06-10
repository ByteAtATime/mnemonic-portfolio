import type { ChainProvider } from '$lib/chains/types';
import { mnemonicToAccount } from 'viem/accounts';
import { EtherTokenProvider } from '$lib/tokens/ether';
import type { TokenProvider } from '$lib/tokens/types';

export abstract class EvmChainProvider implements ChainProvider {
	public abstract name: string;
	public abstract token: TokenProvider;
	public abstract iconPath: string;

	protected constructor(protected rpcUrl: string) {}

	public async getAddressesFromMnemonic(
		mnemonic: string,
		limit: number,
		startAt: number = 0
	): Promise<string[]> {
		const addresses = Array(limit);

		for (let i = 0; i < limit; i++) {
			const addressIndex = startAt + i;

			const account = mnemonicToAccount(mnemonic, {
				addressIndex
			});

			addresses[i] = account.address;
		}

		return addresses;
	}

	async getBalance(address: string): Promise<number> {
		const response = await fetch(this.rpcUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getBalance',
				params: [address, 'latest']
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch balance');
		}

		const data = (await response.json()) as unknown;

		if (
			typeof data !== 'object' ||
			data === null ||
			!('result' in data) ||
			typeof data.result !== 'string'
		) {
			throw new Error('Ethereum node returned invalid result');
		}

		return parseInt(data.result, 16);
	}
}

export class EtherEvmChainProvider extends EvmChainProvider {
	public token = new EtherTokenProvider();

	public constructor(
		rpcUrl: string,
		public name: string,
		public iconPath: string
	) {
		super(rpcUrl);
	}
}
