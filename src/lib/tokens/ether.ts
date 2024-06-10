import type { TokenProvider } from '$lib/tokens/types';

export class EtherTokenProvider implements TokenProvider {
	public name = 'Ether';
	public symbol = 'ETH';
	public decimals = 18;

	private static cachedPrice: number | null = null;
	private static lastPriceUpdate: number | null = null;

	public async getPrice(): Promise<number> {
		if (
			EtherTokenProvider.cachedPrice !== null &&
			EtherTokenProvider.lastPriceUpdate !== null &&
			Date.now() - EtherTokenProvider.lastPriceUpdate < 60000
		) {
			return EtherTokenProvider.cachedPrice;
		}

		const response = await fetch(
			'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
		);

		if (!response.ok) {
			throw new Error('Failed to fetch price');
		}

		const data = (await response.json()) as unknown;

		if (
			typeof data !== 'object' ||
			data === null ||
			!("USD" in data) ||
			typeof data.USD !== 'number'
		) {
			throw new Error('ETH price returned invalid result');
		}

		EtherTokenProvider.cachedPrice = data.USD;
		EtherTokenProvider.lastPriceUpdate = Date.now();

		return EtherTokenProvider.cachedPrice;
	}
}
