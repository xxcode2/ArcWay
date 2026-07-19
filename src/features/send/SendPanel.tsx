import { useState } from "react";
import { isAddress } from "viem";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../../hooks/useToast";
import { sendTokens } from "../../lib/appkit";
import { arcTestnet } from "../../lib/constants";
import {
  AmountInput,
  FieldLabel,
  PanelShell,
  PrimaryButton,
  RowBetween,
  TokenSelect,
} from "../../components/Panel";

const SEND_TOKENS = ["USDC", "EURC"];

export default function SendPanel() {
  const { address, adapter, nativeBalance, connect } = useWallet();
  const { push } = useToast();
  const [token, setToken] = useState("USDC");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const validAddress = to.length === 0 || isAddress(to);

  const onSubmit = async () => {
    if (!address) return connect();
    if (!isAddress(to) || !amount || Number(amount) <= 0) return;
    setLoading(true);
    const _ = push({
      kind: "pending",
      title: `Mengirim ${amount} ${token}`,
      description: `Ke ${to.slice(0, 6)}…${to.slice(-4)} di Arc Testnet`,
    });
    try {
      const result: any = await sendTokens({ adapter, chain: "Arc_Testnet", to, amount, token });
      push({
        kind: "success",
        title: "Pengiriman berhasil",
        description: `${amount} ${token} terkirim.`,
        href: result?.transactionHash
          ? `${arcTestnet.blockExplorers.default.url}/tx/${result.transactionHash}`
          : undefined,
      });
      setAmount("");
      setTo("");
    } catch (e: any) {
      push({
        kind: "error",
        title: "Pengiriman gagal",
        description: e?.message ?? "Terjadi kesalahan saat mengirim token.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelShell
      title="Send"
      subtitle="Kirim stablecoin ke wallet manapun di Arc Testnet"
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    >
      <FieldLabel>Alamat penerima</FieldLabel>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value.trim())}
        placeholder="0x..."
        className={`mb-4 w-full rounded-2xl border bg-black/20 px-4 py-3.5 font-mono text-sm text-arc-text outline-none transition-colors placeholder:text-arc-muted/50 ${
          validAddress ? "border-arc-line focus:border-arc-cyan/60" : "border-red-500/60"
        }`}
      />
      {!validAddress && <p className="-mt-3 mb-3 text-xs text-red-400">Alamat wallet tidak valid.</p>}

      <FieldLabel>Jumlah</FieldLabel>
      <AmountInput
        value={amount}
        onChange={setAmount}
        suffix={<TokenSelect value={token} onChange={setToken} options={SEND_TOKENS} />}
      />

      <div className="mt-4 rounded-xl border border-arc-line/70 bg-black/10 px-3.5 py-2.5">
        <RowBetween left="Saldo gas (USDC)" right={`${Number(nativeBalance).toFixed(4)} USDC`} />
        <RowBetween left="Jaringan" right="Arc Testnet · sub-second finality" />
      </div>

      <PrimaryButton
        onClick={onSubmit}
        disabled={!!address && (!isAddress(to) || !amount || Number(amount) <= 0)}
        loading={loading}
      >
        {!address ? "Connect Wallet" : loading ? "Mengirim…" : "Kirim sekarang"}
      </PrimaryButton>
    </PanelShell>
  );
}
