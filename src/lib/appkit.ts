import { AppKit } from "@circle-fin/app-kit";

/**
 * Single App Kit instance for the whole app, exactly as shown in the docs:
 * https://docs.arc.io/app-kit
 *
 *   const kit = new AppKit();
 *   await kit.send({ from: { adapter, chain }, to, amount, token });
 *   await kit.swap({ from: { adapter, chain }, tokenIn, tokenOut, amountIn, config: { kitKey } });
 *   await kit.bridge({ from: { adapter, chain }, to: { adapter, chain }, amount });
 */
export const kit = new AppKit();

/** Free kit key from Circle Console, required by kit.swap() for fee monetization.
 *  See https://console.circle.com — set VITE_CIRCLE_KIT_KEY in your .env file. */
export const KIT_KEY = import.meta.env.VITE_CIRCLE_KIT_KEY as string | undefined;

export interface SendParams {
  adapter: any;
  chain: string; // e.g. "Arc_Testnet"
  to: string;
  amount: string;
  token: string; // "USDC" | contract address
}

export async function sendTokens({ adapter, chain, to, amount, token }: SendParams) {
  return kit.send({
    from: { adapter, chain: chain as any },
    to,
    amount,
    token,
  } as any);
}

export interface SwapParams {
  adapter: any;
  chain: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
}

export async function swapTokens({ adapter, chain, tokenIn, tokenOut, amountIn }: SwapParams) {
  return kit.swap({
    from: { adapter, chain: chain as any },
    tokenIn,
    tokenOut,
    amountIn,
    config: { kitKey: KIT_KEY },
  } as any);
}

export interface BridgeParams {
  fromAdapter: any;
  fromChain: string;
  toAdapter: any;
  toChain: string;
  amount: string;
}

export async function bridgeTokens({
  fromAdapter,
  fromChain,
  toAdapter,
  toChain,
  amount,
}: BridgeParams) {
  return kit.bridge({
    from: { adapter: fromAdapter, chain: fromChain as any },
    to: { adapter: toAdapter, chain: toChain as any },
    amount,
  } as any);
}
