/**
 * 在 Node 16 / CentOS 7 上构建：先注入 Web Crypto，再调用 Vite API
 */
import { webcrypto } from "node:crypto";

if (typeof globalThis.crypto?.getRandomValues !== "function") {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}

const { build } = await import("vite");

await build();
