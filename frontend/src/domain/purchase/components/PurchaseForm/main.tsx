import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import type { PurchaseFormProps } from './types';

const CATEGORIES = [
  'Frutas',
  'Verduras',
  'Carnes',
  'Laticínios',
  'Grãos',
  'Bebidas',
  'Congelados',
  'Outros',
] as const;

const UNITS = ['kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'dúzia'] as const;

const purchaseSchema = z.object({
  name: z.string().min(3, 'Mínimo de 3 caracteres').max(100, 'Máximo de 100 caracteres'),
  category: z.enum(CATEGORIES),
  purchaseDate: z.string().refine((val) => new Date(val) <= new Date(), 'Data não pode ser futura'),
  unitPrice: z.number().positive('Valor deve ser maior que zero'),
  quantity: z.number().positive('Quantidade deve ser maior que zero'),
  unitMeasure: z.enum(UNITS),
  currency: z.string(),
  location: z.string().max(100).optional(),
  observations: z.string().max(500).optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export const PurchaseForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: PurchaseFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'Outros',
      purchaseDate: initialData?.purchaseDate
        ? new Date(initialData.purchaseDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      unitPrice: initialData?.unitPrice || 0,
      quantity: initialData?.quantity || 1,
      unitMeasure: initialData?.unitMeasure || 'unidade',
      currency: initialData?.currency || 'BRL',
      location: initialData?.location || '',
      observations: initialData?.observations || '',
    },
  });

  const unitPrice = watch('unitPrice');
  const quantity = watch('quantity');
  const total = (unitPrice || 0) * (quantity || 0);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Alimento *</label>
          <input
            {...register('name')}
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2',
              errors.name
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            )}
            placeholder="Ex: Maçã Gala"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
          <select
            {...register('category')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra *</label>
          <input
            type="date"
            {...register('purchaseDate')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.purchaseDate && (
            <p className="mt-1 text-xs text-red-500">{errors.purchaseDate.message}</p>
          )}
        </div>

        {/* Unit Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Unitário (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('unitPrice', { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.unitPrice && (
            <p className="mt-1 text-xs text-red-500">{errors.unitPrice.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
            <input
              type="number"
              step="0.001"
              {...register('quantity', { valueAsNumber: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidade *</label>
            <select
              {...register('unitMeasure')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total (Read Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Total (Estimado)
          </label>
          <div className="w-full rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
          </div>
        </div>

        {/* Location */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Local da Compra</label>
          <input
            {...register('location')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Ex: Supermercado XYZ"
          />
        </div>

        {/* Observations */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            {...register('observations')}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Detalhes adicionais..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar Compra' : 'Cadastrar Compra'}
        </button>
      </div>
    </form>
  );
};
