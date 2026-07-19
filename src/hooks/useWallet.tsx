import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { formatUnits, type Address } from "viem";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import { discoverBrowserWallets, type EIP6963ProviderDetail } from "../lib/discoverWallets";
import { arcTestnet, ARC_TOKENS } from "../lib/constants";
import { chainById, ensureWalletOnChain, getPublicClient } from "../lib/viemClients";

interface WalletState {
  address: Address | null;
  chainId: number | null;
  connecting: boolean;
  wallets: EIP6963ProviderDetail[];
  activeWalletName: string | null;
  nativeBalance: string; // native gas (USDC, 18 decimals) formatted
  usdcErc20Balance: string; // ERC-20-interface USDC (6 decimals) formatted
  error: string | null;
}

interface WalletContextValue extends WalletState {
  connect: (rdns?: string) => Promise<void>;
  disconnect: () => void;
  switchToArc: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  /** Raw EIP-1193 provider of the connected wallet — used to build App Kit adapters. */
  provider: any | null;
  /** App Kit / viem adapter, created once a wallet is connected. */
  adapter: any | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    connecting: false,
    wallets: [],
    activeWalletName: null,
    nativeBalance: "0",
    usdcErc20Balance: "0",
    error: null,
  });
  const [provider, setProvider] = useState<any | null>(null);
  const [adapter, setAdapter] = useState<any | null>(null);

  // Kept in sync with state so refreshBalances always reads the latest
  // address/chainId without needing them in its own dependency array.
  const addressRef = useRef<Address | null>(null);
  const chainIdRef = useRef<number | null>(null);
  addressRef.current = state.address;
  chainIdRef.current = state.chainId;

  useEffect(() => {
    discoverBrowserWallets().then((wallets) => setState((s) => ({ ...s, wallets })));
  }, []);

  const refreshBalances = useCallback(async () => {
    const currentAddress = addressRef.current;
    if (!currentAddress) return;
    try {
      const chain = chainById(chainIdRef.current ?? arcTestnet.id);
      const client = getPublicClient(chain);
      const nativeWei = await client.getBalance({ address: currentAddress });

      let erc20Formatted = "0";
      if (chain.id === arcTestnet.id) {
        try {
          const raw = (await client.readContract({
            address: ARC_TOKENS.USDC.address,
            abi: ERC20_BALANCE_ABI,
            functionName: "balanceOf",
            args: [currentAddress],
          })) as bigint;
          erc20Formatted = formatUnits(raw, ARC_TOKENS.USDC.decimals);
        } catch {
          erc20Formatted = "0";
        }
      }

      setState((s) => ({
        ...s,
        nativeBalance: formatUnits(nativeWei, chain.nativeCurrency.decimals),
        usdcErc20Balance: erc20Formatted,
      }));
    } catch {
      // Non-fatal: RPC hiccup, keep last known balances.
    }
  }, []);

  const attachProviderEvents = useCallback(
    (p: any) => {
      p.on?.("accountsChanged", (accounts: string[]) => {
        if (!accounts?.length) {
          disconnect();
          return;
        }
        setState((s) => ({ ...s, address: accounts[0] as Address }));
        refreshBalances();
      });
      p.on?.("chainChanged", (hexId: string) => {
        setState((s) => ({ ...s, chainId: parseInt(hexId, 16) }));
        refreshBalances();
      });
    },
    [refreshBalances],
  );

  const connect = useCallback(
    async (rdns?: string) => {
      setState((s) => ({ ...s, connecting: true, error: null }));
      try {
        const wallets = state.wallets.length ? state.wallets : await discoverBrowserWallets();
        const selected =
          wallets.find((w) => w.info.rdns === rdns) ??
          wallets.find((w) => w.info.rdns === "io.metamask") ??
          wallets[0];

        if (!selected) {
          throw new Error(
            "Tidak ada wallet terdeteksi. Install MetaMask atau wallet EVM lain lalu refresh halaman.",
          );
        }

        const accounts: string[] = await selected.provider.request({
          method: "eth_requestAccounts",
        });
        const hexChainId: string = await selected.provider.request({ method: "eth_chainId" });

        const viemAdapter = await createViemAdapterFromProvider({
          provider: selected.provider,
        });

        setProvider(selected.provider);
        setAdapter(viemAdapter);
        attachProviderEvents(selected.provider);

        setState((s) => ({
          ...s,
          address: accounts[0] as Address,
          chainId: parseInt(hexChainId, 16),
          connecting: false,
          activeWalletName: selected.info.name,
        }));

        setTimeout(refreshBalances, 50);
      } catch (e: any) {
        setState((s) => ({
          ...s,
          connecting: false,
          error: e?.message ?? "Gagal menghubungkan wallet.",
        }));
      }
    },
    [state.wallets, attachProviderEvents, refreshBalances],
  );

  const disconnect = useCallback(() => {
    setProvider(null);
    setAdapter(null);
    setState((s) => ({
      ...s,
      address: null,
      chainId: null,
      activeWalletName: null,
      nativeBalance: "0",
      usdcErc20Balance: "0",
    }));
  }, []);

  const switchToArc = useCallback(async () => {
    if (!provider) return;
    await ensureWalletOnChain(provider, arcTestnet);
    setState((s) => ({ ...s, chainId: arcTestnet.id }));
    refreshBalances();
  }, [provider, refreshBalances]);

  useEffect(() => {
    if (state.address) refreshBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.address, state.chainId]);

  const value = useMemo<WalletContextValue>(
    () => ({ ...state, connect, disconnect, switchToArc, refreshBalances, provider, adapter }),
    [state, connect, disconnect, switchToArc, refreshBalances, provider, adapter],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

const ERC20_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
