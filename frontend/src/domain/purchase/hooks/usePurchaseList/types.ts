import type { PurchaseListFilters, PurchaseListResponse } from '../../types';

export interface UsePurchaseListOptions {
  filters?: PurchaseListFilters;
  enabled?: boolean;
}

export interface UsePurchaseListReturn {
  data: PurchaseListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}
