import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PanelShell({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-lg"
    >
      <div className="relative rounded-3xl border border-arc-line bg-arc-panel/70 backdrop-blur-2xl p-6 shadow-2xl">
        <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-arc-cyan/60 to-transparent" />
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-arc-blue/30 to-arc-violet/30 border border-arc-line text-arc-cyan">
            {icon}
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-arc-text">{title}</h2>
            <p className="text-xs text-arc-muted">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-arc-muted">{children}</label>;
}

export function AmountInput({
  value,
  onChange,
  suffix,
  placeholder = "0.00",
}: {
  value: string;
  onChange: (v: string) => void;
  suffix?: ReactNode;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-arc-line bg-black/20 px-4 py-3.5 transition-colors focus-within:border-arc-cyan/60">
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9.]/g, "");
          onChange(v);
        }}
        placeholder={placeholder}
        className="w-full bg-transparent font-display text-2xl text-arc-text outline-none placeholder:text-arc-muted/50"
      />
      {suffix}
    </div>
  );
}

export function TokenPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full border border-arc-line bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-arc-text">
      {label}
    </span>
  );
}

export function TokenSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="shrink-0 cursor-pointer rounded-full border border-arc-line bg-white/[0.06] px-3 py-1.5 text-sm font-semibold text-arc-text outline-none hover:border-arc-cyan/50"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-arc-panel">
          {o}
        </option>
      ))}
    </select>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-arc-blue to-arc-violet py-3.5 text-sm font-semibold text-white shadow-glow transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none hover:enabled:brightness-110 active:enabled:scale-[0.99]"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2">
        {loading && <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
        {children}
      </span>
    </button>
  );
}

export function RowBetween({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs text-arc-muted py-1">
      <span>{left}</span>
      <span className="text-arc-text/80">{right}</span>
    </div>
  );
}
