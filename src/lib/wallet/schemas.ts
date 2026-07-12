/**
 * Wallet Schema
 *
 * Defines the Zod schemas and TypeScript types for wallet state.
 *
 * SECURITY FIX: seedPhrase has been REMOVED from this schema.
 * The seed phrase should NEVER be stored in:
 * - React state (exposes to React DevTools)
 * - Zod schemas (serialized to JSON)
 * - LocalStorage or sessionStorage
 * - Any persistent storage
 *
 * The seed phrase should only exist in secure memory during the initial
 * key derivation, then be returned to the user for backup and discarded.
 */

import { z } from "zod";

/**
 * WalletState schema - represents a connected wallet's public information.
 * This is safe to store in React state and serialize.
 */
export const WalletStateSchema = z.object({
  /** Wallet address (0x... for EVM, T... for Tron) */
  address: z.string(),

  /** Blockchain network */
  chain: z.enum(["evm", "tron", "solana"]),

  /** Native token balance (ETH, TRX, SOL) */
  balance: z.number().optional(),

  /** USDC token balance for CAP payments */
  usdcBalance: z.number().optional(),

  /** Whether wallet is currently connected */
  isConnected: z.boolean(),

  /** Whether wallet requires password to sign transactions */
  isLocked: z.boolean(),

  /** Wallet provider name (MetaMask, TronLink, etc.) */
  provider: z.string().optional(),

  /** Current network/chain ID */
  networkId: z.string().optional(),

  /** Timestamp of last transaction */
  lastActivity: z.string().datetime().optional(),
});

export type WalletState = z.infer<typeof WalletStateSchema>;

/**
 * WalletConfig schema - for wallet initialization options.
 * Note: mnemonic is accepted here for initialization but NOT stored.
 */
export const WalletConfigSchema = z.object({
  /** Mnemonic phrase (only used during init, not stored) */
  mnemonic: z.string().optional(),

  /** Target blockchain */
  chain: z.enum(["evm", "tron", "solana"]).default("evm"),

  /** Wallet provider to use */
  provider: z.string().optional(),
});

export type WalletConfig = z.infer<typeof WalletConfigSchema>;

/**
 * WalletError schema - for structured error responses.
 */
export const WalletErrorSchema = z.object({
  code: z.enum([
    "WALLET_NOT_CONNECTED",
    "WALLET_LOCKED",
    "INSUFFICIENT_BALANCE",
    "WRONG_NETWORK",
    "USER_REJECTED",
    "CHAIN_NOT_SUPPORTED",
    "MNEMONIC_INVALID",
  ]),
  message: z.string(),
  details: z.any().optional(),
});

export type WalletError = z.infer<typeof WalletErrorSchema>;

/**
 * TransactionRequest schema - for initiating wallet transactions.
 */
export const TransactionRequestSchema = z.object({
  to: z.string(),
  value: z.number().optional(),
  data: z.string().optional(),
  chain: z.enum(["evm", "tron", "solana"]).optional(),
});

export type TransactionRequest = z.infer<typeof TransactionRequestSchema>;

/**
 * TransactionResult schema - for completed wallet transactions.
 */
export const TransactionResultSchema = z.object({
  txHash: z.string(),
  chain: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.number().optional(),
  status: z.enum(["pending", "confirmed", "failed"]),
  timestamp: z.string().datetime(),
});

export type TransactionResult = z.infer<typeof TransactionResultSchema>;

export default {
  WalletStateSchema,
  WalletConfigSchema,
  WalletErrorSchema,
  TransactionRequestSchema,
  TransactionResultSchema,
};
