import { IApaarVerifier, ApaarRegistryResult } from './apaarVerifier';

export class MockApaarVerifier implements IApaarVerifier {
  async verify(apaarId: string): Promise<ApaarRegistryResult> {
    if (apaarId.endsWith('0000')) {
      return { verified: false, status: 'NOT_FOUND' };
    }
    return {
      verified: true,
      status: 'ACTIVE',
      issuedAt: '2023-01-15T00:00:00.000Z',
    };
  }
}
