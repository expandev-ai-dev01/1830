export type PurchaseCategory =
  | 'Frutas'
  | 'Verduras'
  | 'Carnes'
  | 'Laticínios'
  | 'Grãos'
  | 'Bebidas'
  | 'Congelados'
  | 'Outros';

export type UnitMeasure = 'kg' | 'g' | 'l' | 'ml' | 'unidade' | 'pacote' | 'caixa' | 'dúzia';

export type PurchaseStatus = 'ativo' | 'excluido';

export interface Purchase {
  id: number;
  name: string;
  category: PurchaseCategory;
  purchaseDate: string;
  unitPrice: number;
  quantity: number;
  unitMeasure: UnitMeasure;
  totalValue: number;
  currency: string;
  location?: string | null;
  observations?: string | null;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreatePurchaseDto {
  name: string;
  category: PurchaseCategory;
  purchaseDate: Date;
  unitPrice: number;
  quantity: number;
  unitMeasure: UnitMeasure;
  currency: string;
  location?: string;
  observations?: string;
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> {
  version: number;
}

export interface PurchaseListFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  name?: string;
  status?: PurchaseStatus | 'todos';
  page?: number;
  pageSize?: number;
  orderBy?: 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc' | 'value_desc' | 'value_asc';
}

export interface PurchaseListResponse {
  data: Purchase[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  summary?: {
    monthTotal: number;
  };
}
