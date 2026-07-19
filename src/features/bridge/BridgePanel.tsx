import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../../hooks/useToast";
import { bridgeTokens } from "../../lib/appkit";
import { arcTestnet, ethereumSepolia, baseSepolia } from "../../lib/constants";
import { ensureWalletOnChain } from "../../lib/viemClients";
import {
  AmountInput,
  FieldLabel,
  PanelShell,
  PrimaryButton,
  RowBetween,
  TokenSelect,
} from "../../components/Panel";

const CHAIN_MAP: Record<string, { appKitName: string; chain: typeof arcTestnet }> = {
  Arc_Testnet: { appKitName: "Arc_Testnet", chain: arcTestnet },
  Ethereum_Sepolia: { appKitName: "Ethereum_Sepolia", chain: ethereumSepolia as any },
  Base_Sepolia: { appKitName: "Base_Sepolia", chain: baseSepolia as any },
};
const CHAIN_LABELS = Object.keys(CHAIN_MAP);

export default function BridgePanel() {
  const { address, adapter, provider, connect } = useWallet();
  const { push } = useToast();
  const [from, setFrom] = useState("Ethereum_Sepolia");
  const [to, setTo] = useState("Arc_Testnet");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const flip = () => {
    setFrom(to);
    setTo(from);
  };

  const onSubmit = async () => {
    if (!address) return connect();
    if (!amount || Number(amount) <= 0 || from === to) return;
    setLoading(true);
    push({
      kind: "pending",
      title: `Bridging ${amount} USDC`,
      description: `${from.replace("_", " ")} → ${to.replace("_", " ")} via CCTP`,
    });
    try {
      await ensureWalletOnChain(provider, CHAIN_MAP[from].chain);
      const result: any = await bridgeTokens({
        fromAdapter: adapter,
        fromChain: from,
        toAdapter: adapter,
        toChain: to,
        amount,
      });
      push({
        kind: "success",
        title: "Bridge berhasil dikirim",
        description: `${amount} USDC sedang diproses dari ${from.replace("_", " ")} ke ${to.replace("_", " ")}.`,
        href: result?.transactionHash
          ? `${CHAIN_MAP[from].chain.blockExplorers?.default.url}/tx/${result.transactionHash}`
          : undefined,
      });
      setAmount("");
    } catch (e: any) {
      push({
        kind: "error",
        title: "Bridge gagal",
        description: e?.message ?? "Terjadi kesalahan saat proses bridging.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelShell
      title="Bridge"
      subtitle="Pindahkan USDC lintas chain via Circle CCTP"
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12h4M17 12h4M8 12a4 4 0 0 1 8 0M6 8v8M18 8v8" strokeLinecap="round" />
        </svg>
      }
    >
      <FieldLabel>Dari</FieldLabel>
      <TokenSelect value={from} onChange={setFrom} options={CHAIN_LABELS.filter((c) => c !== to)} />

      <div className="my-3 flex justify-center">
        <motion.button
          whileTap={{ rotate: 180 }}
          onClick={flip}
          className="grid h-9 w-9 place-items-center rounded-xl border border-arc-line bg-arc-panel text-arc-cyan hover:border-arc-cyan/60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <FieldLabel>Ke</FieldLabel>
      <TokenSelect value={to} onChange={setTo} options={CHAIN_LABELS.filter((c) => c !== from)} />

      <div className="mt-4">
        <FieldLabel>Jumlah USDC</FieldLabel>
        <AmountInput value={amount} onChange={setAmount} suffix={<span className="text-sm font-semibold text-arc-text">USDC</span>} />
      </div>

      <div className="mt-4 rounded-xl border border-arc-line/70 bg-black/10 px-3.5 py-2.5">
        <RowBetween left="Protokol" right="Circle CCTP (burn & mint)" />
        <RowBetween left="Token" right="USDC only" />
        <RowBetween left="Estimasi waktu" right="~1–20 menit tergantung chain" />
      </div>

      <PrimaryButton onClick={onSubmit} disabled={!!address && (!amount || from === to)} loading={loading}>
        {!address ? "Connect Wallet" : loading ? "Bridging…" : "Bridge sekarang"}
      </PrimaryButton>
    </PanelShell>
  );
}
