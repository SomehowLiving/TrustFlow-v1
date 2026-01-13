/**
 * Privy stub for owner signing workflow
 *
 * NOTE:
 * - This file documents and exposes a minimal interface that shows how Privy
 *   should be used to sign the address book payload before publishing it.
 * - PRIVY MUST NOT be used by the agent to perform payments or broadcast txs.
 * - This is a stub only; it does not call Privy runtime services here.
 */

export function explainPrivySigning(): string {
    return `Owner should use Privy (or a wallet) to sign the addressbook payload off-line. The signed payload should include the original JSON string as 'signedMessage' and the signature as 'signature'. The API will verify the signature and reject unsigned address books.`;
}
