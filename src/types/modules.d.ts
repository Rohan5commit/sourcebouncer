/**
 * Type declarations for packages that don't exist on npm
 * but are dynamically imported with try/catch for demo mode.
 *
 * These declarations prevent TypeScript build errors while
 * allowing the dynamic imports to gracefully fail at runtime.
 */

declare module "@pear-js/hyperswarm" {
  export class Hyperswarm {
    on(event: string, handler: (...args: any[]) => void): void;
    join(topic: Buffer, options?: any): void;
    leave(topic: Buffer): void;
    destroy(): Promise<void>;
    connect(peer: any): void;
  }

  export class Corestore {
    get(name: string | Buffer): Promise<any>;
    replicate(session: any): any;
    close(): Promise<void>;
  }
}

declare module "@wdk/wallet-evm" {
  export function deriveAddress(mnemonic: string): string;
  export function send(to: string, amount: number): Promise<string>;
}

declare module "@wdk/wallet-tron" {
  export function deriveAddress(mnemonic: string): string;
  export function send(to: string, amount: number): Promise<string>;
}
