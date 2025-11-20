import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchaseList } from '@/domain/purchase/hooks/usePurchaseList';
import { usePurchaseMutations } from '@/domain/purchase/hooks/usePurchaseMutations';
import { PurchaseList } from '@/domain/purchase/components/PurchaseList';
import { PurchaseStats } from '@/domain/purchase/components/PurchaseStats';
import { startOfMonth, endOfMonth } from 'date-fns';
import type { Purchase } from '@/domain/purchase/types';

export const PurchaseListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    status: 'ativo' as const,
  });

  const { data, isLoading, refetch } = usePurchaseList({ filters });
  const { deletePurchase, isDeleting } = usePurchaseMutations();

  const handleDelete = async (purchase: Purchase) => {
    if (window.confirm(`Tem certeza que deseja excluir "${purchase.name}"?`)) {
      try {
        await deletePurchase({ id: purchase.id, version: purchase.version });
        refetch();
      } catch (error) {
        alert('Erro ao excluir registro. Tente novamente.');
      }
    }
  };

  // Calculate total from current page data if summary not provided by backend
  // Ideally backend provides this in data.summary.monthTotal
  const monthTotal =
    data?.summary?.monthTotal ??
    data?.data.reduce(
      (acc, curr) => acc + (curr.totalValue || curr.unitPrice * curr.quantity),
      0
    ) ??
    0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minhas Compras</h1>
        <button
          onClick={() => navigate('/purchases/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          + Nova Compra
        </button>
      </div>

      <PurchaseStats monthTotal={monthTotal} isLoading={isLoading} />

      <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg border border-gray-200">
        {/* Simple Filters UI */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Período</label>
          <div className="flex gap-2">
            <input
              type="date"
              className="border rounded px-2 py-1 text-sm"
              value={filters.startDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: new Date(e.target.value) }))
              }
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="border rounded px-2 py-1 text-sm"
              value={filters.endDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: new Date(e.target.value) }))
              }
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
          >
            Filtrar
          </button>
        </div>
      </div>

      <PurchaseList
        purchases={data?.data || []}
        isLoading={isLoading || isDeleting}
        onEdit={(id) => navigate(`/purchases/${id}/edit`)}
        onDelete={handleDelete}
        onView={(id) => navigate(`/purchases/${id}`)}
      />
    </div>
  );
};

export default PurchaseListPage;
