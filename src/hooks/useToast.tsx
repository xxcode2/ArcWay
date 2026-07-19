import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastKind = "info" | "success" | "error" | "pending";

interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  href?: string;
}

interface ToastContextValue {
  push: (t: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { ...t, id }]);
      if (t.kind !== "pending") {
        window.setTimeout(() => dismiss(id), 7000);
      }
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-[340px]">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`rounded-xl border p-4 backdrop-blur-xl shadow-lg ${
                t.kind === "success"
                  ? "bg-arc-green/10 border-arc-green/40"
                  : t.kind === "error"
                    ? "bg-red-500/10 border-red-500/40"
                    : t.kind === "pending"
                      ? "bg-arc-blue/10 border-arc-blue/40"
                      : "bg-arc-panel border-arc-line"
              }`}
            >
              <div className="flex items-start gap-3">
                {t.kind === "pending" && (
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-arc-cyan border-t-transparent animate-spin" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-arc-text">{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-arc-muted mt-1 break-words">{t.description}</p>
                  )}
                  {t.href && (
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-arc-cyan hover:underline mt-1 inline-block"
                    >
                      Lihat di ArcScan ↗
                    </a>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-arc-muted hover:text-arc-text text-xs"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
