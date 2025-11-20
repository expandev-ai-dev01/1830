import type { CreatePurchaseDto, UpdatePurchaseDto } from '../../types';

export interface UsePurchaseMutationsReturn {
  createPurchase: (data: CreatePurchaseDto) => Promise<any>;
  updatePurchase: (params: { id: number; data: UpdatePurchaseDto }) => Promise<any>;
  deletePurchase: (params: { id: number; version: number }) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}
