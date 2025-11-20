import { useNavigate } from 'react-router-dom';
import { PurchaseForm } from '@/domain/purchase/components/PurchaseForm';
import { usePurchaseMutations } from '@/domain/purchase/hooks/usePurchaseMutations';

export const PurchaseCreatePage = () => {
  const navigate = useNavigate();
  const { createPurchase, isCreating } = usePurchaseMutations();

  const handleSubmit = async (data: any) => {
    try {
      await createPurchase({
        ...data,
        purchaseDate: new Date(data.purchaseDate),
      });
      navigate('/purchases');
    } catch (error) {
      console.error('Failed to create purchase', error);
      alert('Erro ao cadastrar compra. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nova Compra</h1>
        <p className="text-gray-600">Registre os detalhes da sua compra de alimentos.</p>
      </div>

      <PurchaseForm
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
        onCancel={() => navigate('/purchases')}
      />
    </div>
  );
};

export default PurchaseCreatePage;
