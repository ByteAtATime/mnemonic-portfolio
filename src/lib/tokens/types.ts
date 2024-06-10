export interface TokenProvider {
	name: string;
	symbol: string;
	decimals: number;

	getPrice(): Promise<number>;
}
