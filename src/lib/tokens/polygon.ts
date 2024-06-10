import type { TokenProvider } from '$lib/tokens/types';

export class PolygonTokenProvider implements TokenProvider {
	private static cachedPrice: number | null = null;
	private static lastPriceUpdate: number | null = null;
	public name = 'Polygon';
	public symbol = 'MATIC';
	public decimals = 18;

	public async getPrice(): Promise<number> {
		if (
			PolygonTokenProvider.cachedPrice !== null &&
			PolygonTokenProvider.lastPriceUpdate !== null &&
			Date.now() - PolygonTokenProvider.lastPriceUpdate < 60000
		) {
			return PolygonTokenProvider.cachedPrice;
		}

		const response = await fetch(
			'https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD'
		);

		if (!response.ok) {
			throw new Error('Failed to fetch price');
		}

		const data = (await response.json()) as unknown;

		if (
			typeof data !== 'object' ||
			data === null ||
			!('USD' in data) ||
			typeof data.USD !== 'number'
		) {
			throw new Error('MATIC price returned invalid result');
		}


		PolygonTokenProvider.cachedPrice = data.USD;
		PolygonTokenProvider.lastPriceUpdate = Date.now();

		return PolygonTokenProvider.cachedPrice;
	}
}
