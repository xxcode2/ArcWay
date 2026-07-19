# ArcWay

DeFi payments app di **Arc Network (testnet)** — Swap, Send, Bridge, dan Launchpad, dibangun
dengan [Circle App Kit](https://docs.arc.io/app-kit) dan [Arc](https://docs.arc.io/). Wallet
connect, saldo, dan semua transaksi bersifat **nyata di testnet** — tidak ada data dummy/mock.

## Fitur

| Fitur | Cara kerja | SDK |
|---|---|---|
| **Connect Wallet** | Deteksi wallet browser via EIP-6963 (MetaMask, Rabby, dll), auto add/switch ke Arc Testnet | `viem`, EIP-1193/EIP-3085 |
| **Swap** | Tukar USDC / EURC / cirBTC di Arc Testnet | `kit.swap()` — App Kit |
| **Send** | Kirim stablecoin ke wallet manapun di Arc Testnet | `kit.send()` — App Kit |
| **Bridge** | Pindahkan USDC lintas chain (Arc ⇄ Ethereum Sepolia ⇄ Base Sepolia) via CCTP | `kit.bridge()` — App Kit |
| **Launchpad** | Deploy token ERC-20 kamu sendiri langsung ke Arc Testnet | `viem` `deployContract` + Hardhat |

Saldo, harga, dan riwayat token launch semuanya dibaca langsung dari RPC Arc Testnet /
localStorage per-wallet (bukan data statis).

## 1. Prasyarat

- Node.js **v22+**
- Wallet browser (MetaMask direkomendasikan)
- Testnet USDC dari [Circle Faucet](https://faucet.circle.com)
- (Opsional, untuk Swap) Kit key gratis dari [Circle Console](https://console.circle.com)

## 2. Install frontend

```bash
npm install
cp .env.example .env
# isi VITE_CIRCLE_KIT_KEY jika ingin pakai fitur Swap
```

## 3. Compile kontrak Launchpad (sekali saja)

Fitur Launchpad men-deploy kontrak ERC-20 (`contracts/contracts/ArcToken.sol`). Compile dulu
supaya ABI + bytecode tersedia untuk frontend:

```bash
npm run compile:contracts
```

Perintah ini akan `npm install` Hardhat di folder `contracts/`, mengcompile
`ArcToken.sol`, lalu menyalin hasilnya ke `src/contracts/ArcToken.json`. Tanpa langkah ini,
tab Launchpad akan menampilkan peringatan dan tombol "Launch token" tetap nonaktif secara aman.

## 4. Jalankan

```bash
npm run dev
```

Buka `http://localhost:5173`, klik **Connect Wallet**, lalu:

1. Tambahkan **Arc Testnet** ke wallet kamu (tombol "Switch to Arc Testnet" muncul otomatis
   kalau kamu masih di chain lain). Detail chain: Chain ID `5042002`, RPC
   `https://rpc.testnet.arc.network`, gas token USDC (18 desimal).
2. Klaim USDC testnet dari [faucet.circle.com](https://faucet.circle.com).
3. Coba Swap / Send / Bridge / Launchpad — semua transaksi meminta konfirmasi wallet asli dan
   settle onchain sungguhan di testnet.

## Struktur proyek

```
arcway/
├── src/
│   ├── lib/            # chain config, viem clients, App Kit wrapper, EIP-6963 discovery
│   ├── hooks/          # useWallet (connect/balances), useToast
│   ├── components/     # Navbar, WalletButton, Panel primitives, animated background
│   ├── features/        # SwapPanel, SendPanel, BridgePanel, LaunchpadPanel
│   └── contracts/      # compiled ArcToken ABI+bytecode (generated)
└── contracts/
    ├── contracts/ArcToken.sol   # ERC-20 dipakai Launchpad
    ├── hardhat.config.ts        # network Arc Testnet sudah dikonfigurasi
    └── scripts/                 # compile → copy-artifact, dan deploy CLI opsional
```

## Referensi

- Arc developer docs — https://docs.arc.io
- App Kit (Swap/Send/Bridge) — https://docs.arc.io/app-kit
- Circle developer platform — https://developers.circle.com
- Encode Club Arc Hackathon — https://www.encodeclub.com/my-programmes/arc-hackathon

## Catatan penting

- Arc saat ini **hanya tersedia di testnet**. Jangan gunakan private key mainnet di file `.env`.
- Alamat kontrak `EURC` di `src/lib/constants.ts` diambil dari referensi publik testnet —
  selalu cross-check ke `docs.arc.io/arc/references/contract-addresses` sebelum production.
- Kontrak `ArcToken.sol` sengaja minimal (tanpa dependency OpenZeppelin) dan **belum diaudit** —
  cocok untuk demo/hackathon, bukan untuk mainnet/production tanpa audit tambahan.
- Jika `npm install` gagal karena versi `@circle-fin/app-kit` atau `@circle-fin/adapter-viem-v2`
  di `package.json` sudah berubah/dideprecate, jalankan:
  ```bash
  npm install @circle-fin/app-kit@latest @circle-fin/adapter-viem-v2@latest viem@latest
  ```
  lalu cek ulang API-nya di https://docs.arc.io/app-kit — struktur `kit.send/swap/bridge()`
  yang dipakai di `src/lib/appkit.ts` mengikuti contoh resmi di docs tersebut.
