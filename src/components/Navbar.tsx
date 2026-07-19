import { motion } from "framer-motion";
import WalletButton from "./WalletButton";

export type Tab = "swap" | "send" | "bridge" | "launchpad";

const TABS: { id: Tab; label: string }[] = [
  { id: "swap", label: "Swap" },
  { id: "send", label: "Send" },
  { id: "bridge", label: "Bridge" },
  { id: "launchpad", label: "Launchpad" },
];

export default function Navbar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-arc-line/60 bg-arc-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-arc-cyan">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-lg font-semibold tracking-tight text-arc-text">
              Arc<span className="text-arc-cyan">Way</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-arc-line bg-white/[0.03] p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              >
                {active === t.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-arc-blue/80 to-arc-violet/80 shadow-glow"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${active === t.id ? "text-white" : "text-arc-muted hover:text-arc-text"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <WalletButton />
      </div>

      <nav className="flex md:hidden gap-1 overflow-x-auto px-4 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === t.id
                ? "bg-gradient-to-r from-arc-blue to-arc-violet text-white"
                : "bg-white/5 text-arc-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
