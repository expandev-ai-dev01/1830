import type { Purchase } from '../../types';

export interface PurchaseListProps {
  purchases: Purchase[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (purchase: Purchase) => void;
  onView: (id: number) => void;
}
