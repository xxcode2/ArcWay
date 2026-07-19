import { createPublicClient, http, type Chain } from "viem";
import { SUPPORTED_CHAINS, arcTestnet } from "./constants";

const clientCache = new Map<number, ReturnType<typeof createPublicClient>>();

export function getPublicClient(chain: Chain) {
  const cached = clientCache.get(chain.id);
  if (cached) return cached;
  const client = createPublicClient({ chain, transport: http() });
  clientCache.set(chain.id, client);
  return client;
}

export function chainById(id: number): Chain {
  return (SUPPORTED_CHAINS.find((c) => c.id === id) ?? arcTestnet) as Chain;
}

function toHexChainId(id: number) {
  return `0x${id.toString(16)}`;
}

/** Ask the injected wallet (MetaMask, Rabby, Coinbase Wallet, ...) to switch to `chain`,
 *  adding it first if the wallet doesn't know about it yet. This is a real, un-mocked
 *  EIP-3326 / EIP-3085 call against window.ethereum. */
export async function ensureWalletOnChain(provider: any, chain: Chain) {
  const hexId = toHexChainId(chain.id);
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexId }],
    });
  } catch (err: any) {
    // 4902 = chain not added yet
    if (err?.code === 4902 || err?.data?.originalError?.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexId,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [chain.rpcUrls.default.http[0]],
            blockExplorerUrls: chain.blockExplorers?.default.url
              ? [chain.blockExplorers.default.url]
              : [],
          },
        ],
      });
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexId }],
      });
    } else {
      throw err;
    }
  }
}
