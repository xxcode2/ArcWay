import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWallet } from "../hooks/useWallet";
import { arcTestnet } from "../lib/constants";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function WalletButton() {
  const { address, connect, disconnect, connecting, wallets, chainId, switchToArc, activeWalletName } =
    useWallet();
  const [open, setOpen] = useState(false);
  const wrongChain = address && chainId !== arcTestnet.id;

  if (!address) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-arc-blue to-arc-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          {connecting ? "Menghubungkan…" : "Connect Wallet"}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="absolute right-0 mt-2 w-64 rounded-xl border border-arc-line bg-arc-panel/95 backdrop-blur-xl p-2 shadow-xl z-50"
            >
              {wallets.length === 0 && (
                <p className="text-xs text-arc-muted p-3">
                  Tidak ada wallet browser terdeteksi. Install MetaMask lalu refresh halaman.
                </p>
              )}
              {wallets.map((w) => (
                <button
                  key={w.info.uuid}
                  onClick={async () => {
                    await connect(w.info.rdns);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-arc-text hover:bg-white/5 transition-colors"
                >
                  {w.info.icon ? (
                    <img src={w.info.icon} alt="" className="h-6 w-6 rounded" />
                  ) : (
                    <span className="h-6 w-6 rounded bg-arc-blue/30 grid place-items-center text-[10px]">
                      {w.info.name.slice(0, 2)}
                    </span>
                  )}
                  {w.info.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (wrongChain) {
    return (
      <button
        onClick={switchToArc}
        className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-colors animate-pulseGlow"
      >
        Switch to Arc Testnet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:flex items-center gap-1.5 rounded-lg border border-arc-green/30 bg-arc-green/10 px-3 py-1.5 text-xs text-arc-green">
        <span className="h-1.5 w-1.5 rounded-full bg-arc-green animate-pulseGlow" />
        Arc Testnet
      </span>
      <button
        onClick={() => disconnect()}
        title={activeWalletName ?? undefined}
        className="rounded-xl border border-arc-line bg-white/5 px-4 py-2.5 text-sm font-medium text-arc-text hover:border-arc-cyan/50 hover:bg-white/10 transition-colors"
      >
        {short(address)}
      </button>
    </div>
  );
}
