/**
 * @summary
 * Type definitions for Purchase module.
 *
 * @module services/purchase/purchaseTypes
 */

export interface PurchaseEntity {
  id: number;
  idAccount: number;
  name: string;
  category: string;
  purchaseDate: Date;
  unitPrice: number;
  quantity: number;
  unitMeasure: string;
  totalValue: number;
  currency: string;
  location: string | null;
  observations: string | null;
  status: 'ativo' | 'excluido';
  version: number;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface PurchaseCreateRequest {
  idAccount: number;
  name: string;
  category: string;
  purchaseDate: string | Date;
  unitPrice: number;
  quantity: number;
  unitMeasure: string;
  currency: string;
  location?: string | null;
  observations?: string | null;
}

export interface PurchaseUpdateRequest extends PurchaseCreateRequest {
  id: number;
  version: number;
}

export interface PurchaseListFilters {
  idAccount: number;
  startDate?: string | Date;
  endDate?: string | Date;
  category?: string;
  name?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
}

export interface PurchaseListResponse {
  data: PurchaseEntity[];
  metadata: {
    page: number;
    pageSize: number;
    total: number;
    totalValue: number;
  };
}
