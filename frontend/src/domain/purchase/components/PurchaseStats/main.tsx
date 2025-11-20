import { formatCurrency } from '@/core/utils/format';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { PurchaseStatsProps } from './types';

export const PurchaseStats = ({ monthTotal, isLoading }: PurchaseStatsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
        Total Gasto no Mês
      </h3>
      <div className="flex items-baseline">
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(monthTotal)}</span>
        )}
      </div>
    </div>
  );
};
