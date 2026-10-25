import axios from 'axios';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface FuzzyCandidate {
  studentId: string;
  name: string;
  institution: string;
  similarityScore: number;
}

export async function checkFuzzyDuplicates(name: string, dateOfBirth: string): Promise<FuzzyCandidate[]> {
  try {
    const response = await axios.post(`${env.ANALYTICS_URL}/api/v1/fuzzy-match`, {
      name,
      dateOfBirth,
    }, { timeout: 3000 });
    return response.data.matches || [];
  } catch (err: any) {
    logger.warn('Fuzzy matching analytics service call skipped or timed out: ' + err.message);
    return [];
  }
}
