import { Buffer } from "buffer";

// Circle App Kit calls Buffer.from() at module level — inject before any other import
if (typeof (globalThis as any).Buffer === "undefined") {
  (globalThis as any).Buffer = Buffer;
}
