<script lang="ts">
	import { allChains } from '$lib/chains';

	let mnemonic = '';
	let data: Record<string, { chain: number; balance: Promise<number>, balanceUsd: Promise<number> }[]> = {};
	let isLoading = false;
	let totalUsdBalance = 0;

	const handleSubmit = () => {
		isLoading = true;
		totalUsdBalance = 0;

		// wait for the "disabled" attribute to be applied before blocking the UI
		setTimeout(async () => {
			const chainData = await Promise.all(allChains.map(chain =>
				chain.getAddressesFromMnemonic(mnemonic.trim(), 5)
			));

			data = chainData.reduce((acc, chainAddresses, i) => {
				for (const address of chainAddresses) {
					if (!acc[address]) acc[address] = [];

					const balancePromise = allChains[i].getBalance(address);

					const balanceUsdPromise = allChains[i].token.getPrice().then(tokenPrice =>
						balancePromise.then(balance => {
							const usdBalance = (+tokenPrice * balance / 10 ** allChains[i].token.decimals);
							totalUsdBalance += usdBalance;
							return usdBalance;
						})
					);
					acc[address].push({ chain: i, balance: balancePromise, balanceUsd: balanceUsdPromise });
				}
				return acc;
			}, {} as typeof data);

			isLoading = false;
		}, 200);
	};
</script>

<main class="mx-auto max-w-screen-md py-4 flex flex-col gap-y-4 items-center">
	<div class="flex flex-col gap-y-4 w-full">
		<textarea
			bind:value={mnemonic}
			class="textarea textarea-bordered"
			id="message"
			placeholder="Your mnemonic..."
			rows="4"
		/>

		<button class="btn btn-block btn-primary" disabled={isLoading} on:click={handleSubmit}>
			View Portfolio!
		</button>
	</div>

	{#if isLoading}
		<div class="loading loading-lg" />
	{/if}

	{#if totalUsdBalance > 0}
		<div class="flex flex-col items-center mt-4 mb-12">
		<p>
			This mnemonic is worth approximately
		</p>

		<p class="font-bold text-6xl">
			${totalUsdBalance.toFixed(2)} USD
		</p>
		</div>
	{/if}

	<div class="overflow-x-auto w-full">
		<table class="table table-zebra">
			<thead>
			<tr>
				<th>Address</th>
				<th>Network</th>
				<th class="w-40">Balance</th>
			</tr>
			</thead>
			<tbody>
			{#each Object.entries(data) as [address, chains]}
				{#each chains as chainData, i}
					{@const chain = allChains[chainData.chain]}

					<tr>
						{#if i === 0}
							<td rowspan={allChains.length} class="font-mono w-[0.1%]">{address}</td>
						{/if}

						<td>
							<img src={chain.iconPath} alt="{chain.name} icon" class="inline-block w-6 h-6 mr-1" />
							{chain.name}
						</td>

						<td>
							{#await chainData.balance}
								<div class="loading loading-sm" />
							{:then balance}
								{(balance / 10 ** chain.token.decimals).toFixed(4)} {chain.token.symbol}

								<br />

								(&approx;
								{#await chainData.balanceUsd}
									<div class="loading loading-sm" />
								{:then tokenPrice}
									{tokenPrice.toFixed(2)}
								{:catch error}
									<p class="text-red-500">{error.message}</p>
								{/await}
								USD)
							{:catch error}
								<p class="text-red-500">{error.message}</p>
							{/await}
						</td>
					</tr>
				{/each}
			{/each}
			</tbody>
		</table>
	</div>
</main>
