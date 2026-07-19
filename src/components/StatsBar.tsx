import { motion } from "framer-motion";
import { useWallet } from "../hooks/useWallet";
import { FAUCET_URL } from "../lib/constants";

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 rounded-2xl border border-arc-line bg-white/[0.02] px-5 py-4"
    >
      <p className="text-xs text-arc-muted">{label}</p>
      <p className={`mt-1 font-display text-xl font-semibold ${accent ?? "text-arc-text"}`}>{value}</p>
    </motion.div>
  );
}

export default function StatsBar() {
  const { address, nativeBalance, usdcErc20Balance } = useWallet();

  if (!address) {
    return (
      <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-arc-line bg-white/[0.02] px-6 py-4 text-center text-sm text-arc-muted">
        Hubungkan wallet untuk mulai swap, kirim, bridge, atau launch token di Arc Testnet.{" "}
        <a href={FAUCET_URL} target="_blank" rel="noreferrer" className="text-arc-cyan hover:underline">
          Ambil USDC testnet gratis di sini ↗
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-8 flex max-w-4xl flex-col gap-3 sm:flex-row">
      <Stat label="Saldo gas (native USDC)" value={`${Number(nativeBalance).toFixed(4)}`} accent="text-arc-cyan" />
      <Stat label="Saldo USDC (ERC-20)" value={`${Number(usdcErc20Balance).toFixed(2)}`} />
      <Stat label="Jaringan" value="Arc Testnet" accent="text-arc-green" />
    </div>
  );
}
