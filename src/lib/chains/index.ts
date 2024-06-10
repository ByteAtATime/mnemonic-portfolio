import { EtherEvmChainProvider } from '$lib/chains/evm';
import type { ChainProvider } from '$lib/chains/types';
import { PolygonChainProvider } from '$lib/chains/polygon';

export const allChains: ChainProvider[] = [
	new EtherEvmChainProvider('https://eth.llamarpc.com', 'Mainnet', "/chains/mainnet.svg"),
	new EtherEvmChainProvider('https://rpc.ankr.com/optimism', 'Optimism', "/chains/optimism.svg"),
	new PolygonChainProvider('https://rpc.ankr.com/polygon')
];
