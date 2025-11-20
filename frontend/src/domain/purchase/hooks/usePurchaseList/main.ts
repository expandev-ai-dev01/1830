import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseListOptions, UsePurchaseListReturn } from './types';

/**
 * @hook usePurchaseList
 * @summary Hook to fetch paginated and filtered purchase list.
 * @domain purchase
 * @category data
 */
export const usePurchaseList = ({
  filters = {},
  enabled = true,
}: UsePurchaseListOptions = {}): UsePurchaseListReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['purchases', filters],
    queryFn: () => purchaseService.list(filters),
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
