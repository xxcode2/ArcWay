import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./components/Background";
import Navbar, { type Tab } from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import SwapPanel from "./features/swap/SwapPanel";
import SendPanel from "./features/send/SendPanel";
import BridgePanel from "./features/bridge/BridgePanel";
import LaunchpadPanel from "./features/launchpad/LaunchpadPanel";
import { WalletProvider } from "./hooks/useWallet";
import { ToastProvider } from "./hooks/useToast";

function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mb-10 max-w-2xl text-center"
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-arc-line bg-white/[0.03] px-3 py-1 text-xs text-arc-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-arc-green animate-pulseGlow" />
        Live di Arc Testnet · Powered by Circle App Kit
      </span>
      <h1 className="font-display text-4xl font-light leading-tight text-arc-text sm:text-5xl">
        Payments, reimagined for <span className="bg-gradient-to-r from-arc-cyan to-arc-violet bg-clip-text text-transparent">stablecoin finance</span>
      </h1>
      <p className="mt-4 text-sm text-arc-muted sm:text-base">
        Swap, kirim, bridge, dan launch token — semuanya onchain, real-time, di jaringan Arc.
      </p>
    </motion.div>
  );
}

function PanelRouter({ tab }: { tab: Tab }) {
  return (
    <AnimatePresence mode="wait">
      {tab === "swap" && <SwapPanel key="swap" />}
      {tab === "send" && <SendPanel key="send" />}
      {tab === "bridge" && <BridgePanel key="bridge" />}
      {tab === "launchpad" && <LaunchpadPanel key="launchpad" />}
    </AnimatePresence>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("swap");

  return (
    <WalletProvider>
      <ToastProvider>
        <Background />
        <Navbar active={tab} onChange={setTab} />
        <main className="px-6 pb-24 pt-14">
          <Hero />
          <StatsBar />
          <PanelRouter tab={tab} />
        </main>
        <footer className="border-t border-arc-line/60 py-8 text-center text-xs text-arc-muted">
          ArcWay · Built with Circle App Kit on Arc Testnet · Not audited, for demo &amp; hackathon use only.
        </footer>
      </ToastProvider>
    </WalletProvider>
  );
}
