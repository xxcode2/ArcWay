/**
 * EIP-6963 "Multi Injected Provider Discovery" — the standard, wallet-agnostic way
 * modern browser wallets (MetaMask, Rabby, Coinbase Wallet, Backpack, etc.) announce
 * themselves. This talks to real `window` events; nothing here is mocked.
 *
 * App Kit's browser-wallet quickstarts use an equivalent `discoverBrowserWallets()`
 * helper — this local implementation gives the same real result without depending on
 * that export's exact path, and falls back to `window.ethereum` for older wallets.
 */
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

export function discoverBrowserWallets(timeoutMs = 250): Promise<EIP6963ProviderDetail[]> {
  return new Promise((resolve) => {
    const found = new Map<string, EIP6963ProviderDetail>();

    function onAnnounce(event: Event) {
      const detail = (event as CustomEvent<EIP6963ProviderDetail>).detail;
      if (detail?.info?.uuid) found.set(detail.info.uuid, detail);
    }

    window.addEventListener("eip6963:announceProvider", onAnnounce as EventListener);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    window.setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce as EventListener);

      if (found.size === 0 && typeof (window as any).ethereum !== "undefined") {
        // Legacy fallback: a single injected provider with no EIP-6963 announcement.
        found.set("legacy-injected", {
          info: {
            uuid: "legacy-injected",
            name: (window as any).ethereum.isMetaMask ? "MetaMask" : "Injected Wallet",
            icon: "",
            rdns: (window as any).ethereum.isMetaMask ? "io.metamask" : "injected",
          },
          provider: (window as any).ethereum,
        });
      }

      resolve(Array.from(found.values()));
    }, timeoutMs);
  });
}
