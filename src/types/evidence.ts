export interface EvidenceBundle {
  // Arbitrary JSON payload containing proof data from both parties
  buyerProof: any;
  sellerProof: any;
  // Optional timestamp of when the evidence was posted
  timestamp: number;
}
