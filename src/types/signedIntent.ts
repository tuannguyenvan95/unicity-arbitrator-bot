export interface SignedIntent {
  // Unique identifier of the transaction
  id: string;
  // Public keys of buyer and seller (hex strings)
  buyerPubKey: string;
  sellerPubKey: string;
  // Expected data hash (sha256 hex) that the seller must deliver
  expectedDataHash: string;
  // Deadline timestamp (unix seconds) after which buyer can claim timeout
  deadline: number;
  // Any additional fields relevant to the escrow
  [key: string]: any;
}
