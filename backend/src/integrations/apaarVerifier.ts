export interface ApaarRegistryResult {
  verified: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'NOT_FOUND';
  issuedAt?: string;
}

export interface IApaarVerifier {
  verify(apaarId: string): Promise<ApaarRegistryResult>;
}
