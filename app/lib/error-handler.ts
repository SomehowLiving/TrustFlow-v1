/**
 * Error handling and recovery utilities for TrustFlow
 * Handles: API errors, contract interactions, user-facing messages
 */

import { ApiResponseError } from "@/types/api-response-error";

export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export interface HandledError {
    message: string;
    code?: string | number;
    severity: ErrorSeverity;
    details?: string;
    retry?: boolean;
    action?: string;
}

/**
 * Parse and normalize errors from various sources
 */
export const parseError = (error: unknown): HandledError => {
    // API Response Error
    if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiResponseError;
        return {
            message: apiError.message || "An error occurred",
            code: apiError.code,
            severity: "error",
            retry: false,
        };
    }

    // Network/Fetch Errors
    if (error instanceof TypeError) {
        if (error.message.includes("fetch")) {
            return {
                message: "Network error. Please check your connection.",
                severity: "warning",
                retry: true,
            };
        }
    }

    // Error Object
    if (error instanceof Error) {
        // Smart contract revert
        if (error.message.includes("reverted")) {
            return {
                message: "Transaction was rejected. Please check your input and try again.",
                severity: "error",
                details: error.message,
                retry: true,
            };
        }

        // Insufficient funds
        if (error.message.includes("insufficient") || error.message.includes("balance")) {
            return {
                message: "Insufficient balance. Please fund your wallet.",
                severity: "warning",
                action: "fund-wallet",
            };
        }

        // Gas estimation failure
        if (error.message.includes("gas")) {
            return {
                message: "Transaction cost estimation failed. Please try again.",
                severity: "warning",
                retry: true,
            };
        }

        // Generic error message
        return {
            message: error.message || "An unexpected error occurred",
            severity: "error",
            details: error.stack,
        };
    }

    // Unknown error
    return {
        message: typeof error === "string" ? error : "An unknown error occurred",
        severity: "error",
    };
};

/**
 * Handle contract interaction errors
 */
export const handleContractError = (error: unknown): HandledError => {
    const parsed = parseError(error);

    if (error instanceof Error) {
        // Specific contract errors
        if (error.message.includes("Policy")) {
            return {
                message: "Payment violates your spending policy. Check limits and try again.",
                severity: "warning",
                details: error.message,
            };
        }

        if (error.message.includes("approved")) {
            return {
                message: "Recipient is not approved. Add them to your address book.",
                severity: "error",
                action: "add-recipient",
            };
        }

        if (error.message.includes("expired")) {
            return {
                message: "Your agent authorization expired. Please reconfigure and try again.",
                severity: "warning",
                retry: true,
            };
        }
    }

    return parsed;
};

/**
 * Handle backend API errors with proper retry logic
 */
export const handleApiError = (error: unknown, endpoint: string): HandledError => {
    const parsed = parseError(error);

    // Check if error is retryable
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
            message.includes("timeout") ||
            message.includes("network") ||
            message.includes("503") ||
            message.includes("502")
        ) {
            return {
                ...parsed,
                retry: true,
                message: `Failed to ${endpoint}. Retrying...`,
            };
        }
    }

    return parsed;
};

/**
 * User-friendly error messages for common scenarios
 */
export const getErrorMessage = (error: HandledError): string => {
    if (error.action === "fund-wallet") {
        return `${error.message} You can fund your wallet using Coinbase Onramp.`;
    }

    if (error.action === "add-recipient") {
        return `${error.message} Go to settings to add approved recipients.`;
    }

    return error.message;
};

/**
 * Check if error should be retried automatically
 */
export const shouldRetry = (error: HandledError, attempt: number): boolean => {
    if (!error.retry) return false;
    if (attempt > 3) return false;
    return true;
};

/**
 * Exponential backoff retry with error handling
 */
export const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3
): Promise<{ data?: T; error?: HandledError }> => {
    let lastError: HandledError | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const data = await fn();
            return { data };
        } catch (error) {
            lastError = parseError(error);

            if (!shouldRetry(lastError, attempt)) {
                return { error: lastError };
            }

            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    return { error: lastError || { message: "Unknown error", severity: "error" } };
};

/**
 * Format error for logging
 */
export const formatErrorLog = (error: HandledError, context: string): string => {
    return `[${context}] ${error.severity.toUpperCase()}: ${error.message}${error.code ? ` (${error.code})` : ""
        }${error.details ? `\n${error.details}` : ""}`;
};

/**
 * Check if user should be prompted to retry
 */
export const userShouldRetry = (error: HandledError): boolean => {
    return (
        error.severity === "warning" &&
        error.retry !== false &&
        error.action !== "add-recipient" &&
        error.action !== "fund-wallet"
    );
};
