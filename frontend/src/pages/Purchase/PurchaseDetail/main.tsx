import { useNavigate, useParams } from 'react-router-dom';
import { usePurchaseDetail } from '@/domain/purchase/hooks/usePurchaseDetail';
import { usePurchaseMutations } from '@/domain/purchase/hooks/usePurchaseMutations';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/core/utils/format';

export const PurchaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const purchaseId = Number(id);

  const { purchase, isLoading } = usePurchaseDetail({ id: purchaseId });
  const { deletePurchase, isDeleting } = usePurchaseMutations();

  const handleDelete = async () => {
    if (!purchase) return;
    if (window.confirm(`Tem certeza que deseja excluir "${purchase.name}"?`)) {
      try {
        await deletePurchase({ id: purchase.id, version: purchase.version });
        navigate('/purchases');
      } catch (error) {
        alert('Erro ao excluir registro.');
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );
  if (!purchase) return <div className="text-center p-12">Registro não encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes da Compra</h1>
          <p className="text-gray-600">Visualizando registro #{purchaseId}</p>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => navigate(`/purchases/${purchaseId}/edit`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{purchase.name}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{purchase.category}</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data da Compra</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(purchase.purchaseDate)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Valor Unitário</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatCurrency(purchase.unitPrice)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Quantidade</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase.quantity} {purchase.unitMeasure}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Valor Total</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                {formatCurrency(purchase.totalValue || purchase.unitPrice * purchase.quantity)}
              </dd>
            </div>
            {purchase.location && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Local</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {purchase.location}
                </dd>
              </div>
            )}
            {purchase.observations && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Observações</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {purchase.observations}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/purchases')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          &larr; Voltar para lista
        </button>
      </div>
    </div>
  );
};

export default PurchaseDetailPage;
