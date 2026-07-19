import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../../hooks/useToast";
import { swapTokens } from "../../lib/appkit";
import { arcTestnet } from "../../lib/constants";
import {
  AmountInput,
  FieldLabel,
  PanelShell,
  PrimaryButton,
  RowBetween,
  TokenSelect,
} from "../../components/Panel";

const SWAP_TOKENS = ["USDC", "EURC", "cirBTC"];

export default function SwapPanel() {
  const { address, adapter, chainId, connect } = useWallet();
  const { push } = useToast();
  const [tokenIn, setTokenIn] = useState("USDC");
  const [tokenOut, setTokenOut] = useState("EURC");
  const [amountIn, setAmountIn] = useState("");
  const [loading, setLoading] = useState(false);

  const swap = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  };

  const onSubmit = async () => {
    if (!address) return connect();
    if (!amountIn || Number(amountIn) <= 0) return;
    setLoading(true);
    const toastId = push({
      kind: "pending",
      title: `Swapping ${amountIn} ${tokenIn} → ${tokenOut}`,
      description: "Menunggu konfirmasi wallet dan settlement onchain...",
    });
    try {
      const result: any = await swapTokens({
        adapter,
        chain: "Arc_Testnet",
        tokenIn,
        tokenOut,
        amountIn,
      });
      push({
        kind: "success",
        title: "Swap berhasil",
        description: `${amountIn} ${tokenIn} → ${tokenOut} di Arc Testnet.`,
        href: result?.transactionHash
          ? `${arcTestnet.blockExplorers.default.url}/tx/${result.transactionHash}`
          : undefined,
      });
      setAmountIn("");
    } catch (e: any) {
      push({
        kind: "error",
        title: "Swap gagal",
        description: e?.message ?? "Terjadi kesalahan saat memproses swap.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelShell
      title="Swap"
      subtitle="Tukar stablecoin secara instan di Arc Testnet"
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 7h13l-3-3M17 17H4l3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    >
      <FieldLabel>Kamu bayar</FieldLabel>
      <AmountInput
        value={amountIn}
        onChange={setAmountIn}
        suffix={<TokenSelect value={tokenIn} onChange={setTokenIn} options={SWAP_TOKENS} />}
      />

      <div className="relative my-1 flex justify-center">
        <motion.button
          whileTap={{ rotate: 180, scale: 0.9 }}
          onClick={swap}
          className="z-10 -my-2 grid h-9 w-9 place-items-center rounded-xl border border-arc-line bg-arc-panel text-arc-cyan shadow-md hover:border-arc-cyan/60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <FieldLabel>Kamu terima (estimasi)</FieldLabel>
      <AmountInput
        value={amountIn ? amountIn : ""}
        onChange={() => {}}
        placeholder="0.00"
        suffix={<TokenSelect value={tokenOut} onChange={setTokenOut} options={SWAP_TOKENS} />}
      />

      <div className="mt-4 rounded-xl border border-arc-line/70 bg-black/10 px-3.5 py-2.5">
        <RowBetween left="Jaringan" right="Arc Testnet" />
        <RowBetween left="Rute" right="App Kit Swap (routing likuiditas)" />
        <RowBetween left="Perkiraan biaya gas" right="~0.001 USDC" />
      </div>

      <PrimaryButton onClick={onSubmit} disabled={!amountIn && !!address} loading={loading}>
        {!address ? "Connect Wallet" : loading ? "Memproses…" : "Swap sekarang"}
      </PrimaryButton>
    </PanelShell>
  );
}
