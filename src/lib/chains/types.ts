import type { TokenProvider } from '$lib/tokens/types';

export interface ChainProvider {
	name: string;
	token: TokenProvider;
	iconPath: string;

	getAddressesFromMnemonic(mnemonic: string, limit: number, skip?: number): Promise<string[]>;

	getBalance(address: string): Promise<number>;
}
