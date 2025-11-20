import type { Purchase } from '../../types';

export interface PurchaseFormProps {
  initialData?: Purchase;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  onCancel: () => void;
}
