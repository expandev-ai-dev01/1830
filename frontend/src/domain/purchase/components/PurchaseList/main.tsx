import { formatCurrency, formatDate } from '@/core/utils/format';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { PurchaseListProps } from './types';

export const PurchaseList = ({
  purchases,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: PurchaseListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">Nenhuma compra encontrada.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alimento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Total
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(purchase.purchaseDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <button
                  onClick={() => onView(purchase.id)}
                  className="hover:text-blue-600 hover:underline"
                >
                  {purchase.name}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {purchase.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                {formatCurrency(purchase.totalValue || purchase.unitPrice * purchase.quantity)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(purchase.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(purchase)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
