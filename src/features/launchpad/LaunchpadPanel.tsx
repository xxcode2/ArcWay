import { useEffect, useState } from "react";
import { createWalletClient, custom, parseUnits } from "viem";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../../hooks/useToast";
import { arcTestnet } from "../../lib/constants";
import artifact from "../../contracts/ArcToken.json";
import {
  FieldLabel,
  PanelShell,
  PrimaryButton,
  RowBetween,
} from "../../components/Panel";

interface LaunchedToken {
  address: string;
  name: string;
  symbol: string;
  supply: string;
  txHash: string;
  deployedAt: number;
}

function storageKey(owner: string) {
  return `arcway:launches:${owner.toLowerCase()}`;
}

export default function LaunchpadPanel() {
  const { address, provider, connect } = useWallet();
  const { push } = useToast();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000");
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<LaunchedToken[]>([]);

  const artifactReady = (artifact as any).bytecode && (artifact as any).bytecode !== "0x";

  useEffect(() => {
    if (!address) return setTokens([]);
    try {
      const raw = localStorage.getItem(storageKey(address));
      setTokens(raw ? JSON.parse(raw) : []);
    } catch {
      setTokens([]);
    }
  }, [address]);

  const persist = (list: LaunchedToken[]) => {
    if (!address) return;
    localStorage.setItem(storageKey(address), JSON.stringify(list));
    setTokens(list);
  };

  const onDeploy = async () => {
    if (!address) return connect();
    if (!artifactReady) {
      push({
        kind: "error",
        title: "Kontrak belum di-compile",
        description:
          "Jalankan `npm run compile:contracts` di root project untuk meng-compile ArcToken.sol sebelum deploy.",
      });
      return;
    }
    if (!name || !symbol || !supply || Number(supply) <= 0) return;

    setLoading(true);
    push({
      kind: "pending",
      title: `Deploying ${symbol}`,
      description: "Mengirim transaksi kontrak ke Arc Testnet...",
    });
    try {
      const walletClient = createWalletClient({
        chain: arcTestnet,
        transport: custom(provider),
        account: address as `0x${string}`,
      });

      const hash = await walletClient.deployContract({
        abi: (artifact as any).abi,
        bytecode: (artifact as any).bytecode,
        args: [name, symbol, parseUnits(supply, 18), address],
      });

      push({
        kind: "success",
        title: "Transaksi deploy terkirim",
        description: `Menunggu konfirmasi untuk ${symbol}...`,
        href: `${arcTestnet.blockExplorers.default.url}/tx/${hash}`,
      });

      // Poll for the receipt to learn the deployed contract address.
      const { createPublicClient, http } = await import("viem");
      const publicClient = createPublicClient({ chain: arcTestnet, transport: http() });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const launched: LaunchedToken = {
        address: receipt.contractAddress ?? "",
        name,
        symbol,
        supply,
        txHash: hash,
        deployedAt: Date.now(),
      };
      persist([launched, ...tokens]);

      push({
        kind: "success",
        title: `${symbol} berhasil di-launch`,
        description: `Kontrak: ${launched.address.slice(0, 10)}…`,
        href: `${arcTestnet.blockExplorers.default.url}/address/${launched.address}`,
      });

      setName("");
      setSymbol("");
      setSupply("1000000");
    } catch (e: any) {
      push({
        kind: "error",
        title: "Deploy gagal",
        description: e?.shortMessage ?? e?.message ?? "Terjadi kesalahan saat deploy token.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_1fr]">
      <PanelShell
        title="Launchpad"
        subtitle="Deploy token ERC-20 milikmu sendiri di Arc Testnet"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        {!artifactReady && (
          <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-xs text-amber-300">
            Kontrak <code>ArcToken.sol</code> belum di-compile. Jalankan{" "}
            <code className="rounded bg-black/30 px-1">npm run compile:contracts</code> dari root
            project (butuh koneksi internet untuk mengunduh Hardhat sekali saja), lalu refresh.
          </div>
        )}

        <FieldLabel>Nama token</FieldLabel>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ArcWay Community Token"
          className="mb-4 w-full rounded-2xl border border-arc-line bg-black/20 px-4 py-3.5 text-sm text-arc-text outline-none focus:border-arc-cyan/60 placeholder:text-arc-muted/50"
        />

        <FieldLabel>Simbol</FieldLabel>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase().slice(0, 8))}
          placeholder="AWT"
          className="mb-4 w-full rounded-2xl border border-arc-line bg-black/20 px-4 py-3.5 text-sm text-arc-text outline-none focus:border-arc-cyan/60 placeholder:text-arc-muted/50"
        />

        <FieldLabel>Total supply awal</FieldLabel>
        <input
          inputMode="numeric"
          value={supply}
          onChange={(e) => setSupply(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full rounded-2xl border border-arc-line bg-black/20 px-4 py-3.5 text-sm text-arc-text outline-none focus:border-arc-cyan/60"
        />

        <div className="mt-4 rounded-xl border border-arc-line/70 bg-black/10 px-3.5 py-2.5">
          <RowBetween left="Jaringan" right="Arc Testnet" />
          <RowBetween left="Standar" right="ERC-20, 18 desimal" />
          <RowBetween left="Mint lanjutan" right="Owner-only, bisa mint tambahan" />
        </div>

        <PrimaryButton
          onClick={onDeploy}
          disabled={!!address && (!name || !symbol || !supply)}
          loading={loading}
        >
          {!address ? "Connect Wallet" : loading ? "Deploying…" : "Launch token"}
        </PrimaryButton>
      </PanelShell>

      <div className="rounded-3xl border border-arc-line bg-arc-panel/70 backdrop-blur-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-arc-text mb-1">Token kamu</h3>
        <p className="mb-4 text-xs text-arc-muted">Riwayat token yang sudah kamu deploy dari wallet ini.</p>
        {!address && <p className="text-sm text-arc-muted">Connect wallet untuk melihat riwayat launch.</p>}
        {address && tokens.length === 0 && (
          <p className="text-sm text-arc-muted">Belum ada token yang di-launch dari wallet ini.</p>
        )}
        <div className="flex flex-col gap-3">
          {tokens.map((t) => (
            <a
              key={t.txHash}
              href={`${arcTestnet.blockExplorers.default.url}/address/${t.address}`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-arc-line bg-white/[0.02] p-3.5 transition-colors hover:border-arc-cyan/50 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-arc-text">{t.name}</span>
                <span className="rounded-full bg-arc-blue/20 px-2 py-0.5 text-xs text-arc-cyan">{t.symbol}</span>
              </div>
              <p className="mt-1 truncate font-mono text-xs text-arc-muted">{t.address}</p>
              <p className="mt-1 text-xs text-arc-muted">
                Supply: {Number(t.supply).toLocaleString("id-ID")} · {new Date(t.deployedAt).toLocaleString("id-ID")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
