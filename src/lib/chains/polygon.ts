import { EvmChainProvider } from '$lib/chains/evm';
import { PolygonTokenProvider } from '$lib/tokens/polygon';

export class PolygonChainProvider extends EvmChainProvider {
	public name = 'Polygon';
	public token = new PolygonTokenProvider();
	public iconPath = '/chains/polygon.svg';

	public constructor(rpcUrl: string) {
		super(rpcUrl);
	}
}
