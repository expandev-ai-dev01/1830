import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseDetailOptions, UsePurchaseDetailReturn } from './types';

/**
 * @hook usePurchaseDetail
 * @summary Hook to fetch a single purchase details.
 * @domain purchase
 * @category data
 */
export const usePurchaseDetail = ({
  id,
  enabled = true,
}: UsePurchaseDetailOptions): UsePurchaseDetailReturn => {
  const {
    data: purchase,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['purchase', id],
    queryFn: () => purchaseService.getById(id),
    enabled: enabled && !!id,
  });

  return {
    purchase,
    isLoading,
    error,
  };
};
