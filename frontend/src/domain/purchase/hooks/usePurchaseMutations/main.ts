import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseMutationsReturn } from './types';

/**
 * @hook usePurchaseMutations
 * @summary Hook for creating, updating and deleting purchases.
 * @domain purchase
 * @category data
 */
export const usePurchaseMutations = (): UsePurchaseMutationsReturn => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: purchaseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => purchaseService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, version }: { id: number; version: number }) =>
      purchaseService.delete(id, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    createPurchase: createMutation.mutateAsync,
    updatePurchase: updateMutation.mutateAsync,
    deletePurchase: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
