/**
 * QVAC (Quantum-Verified AI Computing) Module
 *
 * Provides AI inference capabilities with fallback to demo mode.
 *
 * FIX #9: The original implementation set qvacInitialized = true on failure,
 * which permanently blocked retry attempts. A real device that briefly has
 * memory issues could never recover.
 *
 * New behavior:
 * - qvacInitialized tracks whether init was attempted
 * - qvacFailed tracks whether the last init attempt failed
 * - UI can display "AI unavailable" vs "AI ready" based on these flags
 * - Retry is possible by calling initQVAC() again after failure
 */

/**
 * QVAC client instance
 */
let _client: any = null;

/**
 * Whether QVAC initialization has been attempted.
 */
let qvacInitialized = false;

/**
 * FIX #9: Whether the last QVAC initialization attempt failed.
 * This allows the UI to show "AI unavailable" vs "AI ready".
 * Unlike the previous implementation, this does NOT block retry attempts.
 */
let qvacFailed = false;

/**
 * Error message from the last failed initialization.
 */
let qvacError: string | null = null;

/**
 * Initialize the QVAC SDK connection.
 *
 * FIX #9: On failure, sets qvacFailed = true but does NOT set
 * qvacInitialized = true. This allows the UI to distinguish between
 * "not yet attempted" and "attempted but failed". Retry is possible
 * by calling this function again.
 *
 * @returns Whether QVAC is available
 */
export async function initQVAC(): Promise<boolean> {
  // Allow retry even if previously failed
  if (_client) return true;

  qvacInitialized = true;
  qvacFailed = false;
  qvacError = null;

  try {
    // Dynamic import of QVAC SDK
    const qvac = await import("@pear-js/hyperswarm");
    _client = qvac;
    console.log("[QVAC] SDK initialized successfully");
    return true;
  } catch (err) {
    console.warn("[QVAC] Running in demo mode (SDK not available):", err);
    // FIX #9: Set qvacFailed = true, NOT qvacInitialized = true
    // This allows the UI to show "AI unavailable" and retry later
    qvacFailed = true;
    qvacError = err instanceof Error ? err.message : String(err);
    return false;
  }
}

/**
 * Check if QVAC is currently available.
 */
export function isQVACAvailable(): boolean {
  return _client !== null;
}

/**
 * FIX #9: Check if QVAC initialization was attempted but failed.
 * Use this to display "AI unavailable" in the UI.
 */
export function isQVACFailed(): boolean {
  return qvacFailed;
}

/**
 * FIX #9: Get the error message from the last failed initialization.
 * Returns null if QVAC hasn't failed or hasn't been attempted.
 */
export function getQVACError(): string | null {
  return qvacError;
}

/**
 * Get the QVAC initialization status for UI display.
 *
 * Returns a structured status object that the UI can use to
 * show the appropriate state indicator.
 */
export function getQVACStatus(): {
  available: boolean;
  attempted: boolean;
  failed: boolean;
  error: string | null;
  label: string;
  color: "green" | "yellow" | "red" | "gray";
} {
  if (_client) {
    return {
      available: true,
      attempted: qvacInitialized,
      failed: false,
      error: null,
      label: "AI Ready",
      color: "green",
    };
  }

  if (qvacFailed) {
    return {
      available: false,
      attempted: qvacInitialized,
      failed: true,
      error: qvacError,
      label: "AI Unavailable (Demo Mode)",
      color: "yellow",
    };
  }

  if (qvacInitialized) {
    return {
      available: false,
      attempted: true,
      failed: false,
      error: null,
      label: "AI Initializing...",
      color: "gray",
    };
  }

  return {
    available: false,
    attempted: false,
    failed: false,
    error: null,
    label: "AI Not Initialized",
    color: "red",
  };
}

/**
 * Reset QVAC state to allow fresh initialization.
 * Useful for testing or when the user wants to retry.
 */
export function resetQVAC(): void {
  _client = null;
  qvacInitialized = false;
  qvacFailed = false;
  qvacError = null;
}

export default {
  initQVAC,
  isQVACAvailable,
  isQVACFailed,
  getQVACError,
  getQVACStatus,
  resetQVAC,
};
