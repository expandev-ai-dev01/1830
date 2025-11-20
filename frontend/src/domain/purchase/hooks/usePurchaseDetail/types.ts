import type { Purchase } from '../../types';

export interface UsePurchaseDetailOptions {
  id: number;
  enabled?: boolean;
}

export interface UsePurchaseDetailReturn {
  purchase: Purchase | undefined;
  isLoading: boolean;
  error: unknown;
}
