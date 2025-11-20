import { authenticatedClient } from '@/core/lib/api';
import type {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  PurchaseListFilters,
  PurchaseListResponse,
} from '../types';

/**
 * @service purchaseService
 * @summary Service for managing purchase records via backend API.
 * @domain purchase
 * @type rest-service
 * @apiContext internal
 */
export const purchaseService = {
  /**
   * @endpoint GET /api/v1/internal/purchase
   * @summary Lists purchases with filtering and pagination.
   */
  async list(filters: PurchaseListFilters = {}): Promise<PurchaseListResponse> {
    const params = {
      ...filters,
      startDate: filters.startDate?.toISOString(),
      endDate: filters.endDate?.toISOString(),
    };
    const response = await authenticatedClient.get('/purchase', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/purchase/:id
   * @summary Gets a single purchase by ID.
   */
  async getById(id: number): Promise<Purchase> {
    const response = await authenticatedClient.get(`/purchase/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/purchase
   * @summary Creates a new purchase record.
   */
  async create(data: CreatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.post('/purchase', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/purchase/:id
   * @summary Updates an existing purchase record.
   */
  async update(id: number, data: UpdatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.put(`/purchase/${id}`, data);
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/purchase/:id
   * @summary Logically deletes a purchase record.
   */
  async delete(id: number, version: number): Promise<void> {
    await authenticatedClient.delete(`/purchase/${id}`, {
      data: { version, confirm: true },
    });
  },
};
