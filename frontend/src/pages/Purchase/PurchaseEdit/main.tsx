import { useNavigate, useParams } from 'react-router-dom';
import { PurchaseForm } from '@/domain/purchase/components/PurchaseForm';
import { usePurchaseMutations } from '@/domain/purchase/hooks/usePurchaseMutations';
import { usePurchaseDetail } from '@/domain/purchase/hooks/usePurchaseDetail';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

export const PurchaseEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const purchaseId = Number(id);

  const { purchase, isLoading } = usePurchaseDetail({ id: purchaseId });
  const { updatePurchase, isUpdating } = usePurchaseMutations();

  const handleSubmit = async (data: any) => {
    if (!purchase) return;

    try {
      await updatePurchase({
        id: purchaseId,
        data: {
          ...data,
          purchaseDate: new Date(data.purchaseDate),
          version: purchase.version,
        },
      });
      navigate('/purchases');
    } catch (error) {
      console.error('Failed to update purchase', error);
      alert(
        'Erro ao atualizar compra. Verifique se o registro não foi modificado por outro usuário.'
      );
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Compra</h1>
        <p className="text-gray-600">Atualize os detalhes da compra #{purchaseId}.</p>
      </div>

      <PurchaseForm
        initialData={purchase}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        onCancel={() => navigate('/purchases')}
      />
    </div>
  );
};

export default PurchaseEditPage;
