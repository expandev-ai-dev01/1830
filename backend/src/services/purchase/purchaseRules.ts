/**
 * @summary
 * Business logic for Purchase module.
 * Handles CRUD operations and business rules for food purchases.
 *
 * @module services/purchase/purchaseRules
 */

import { getPool } from '@/utils/database';
import {
  PurchaseCreateRequest,
  PurchaseUpdateRequest,
  PurchaseListFilters,
  PurchaseEntity,
  PurchaseListResponse,
} from './purchaseTypes';

/**
 * Creates a new purchase record.
 * Calculates total value automatically.
 */
export async function purchaseCreate(params: PurchaseCreateRequest): Promise<{ id: number }> {
  const pool = await getPool();

  // BR-001: Calculate total value automatically
  const totalValue = Number((params.unitPrice * params.quantity).toFixed(2));

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('name', params.name)
    .input('category', params.category)
    .input('purchaseDate', params.purchaseDate)
    .input('unitPrice', params.unitPrice)
    .input('quantity', params.quantity)
    .input('unitMeasure', params.unitMeasure)
    .input('totalValue', totalValue)
    .input('currency', params.currency)
    .input('location', params.location || null)
    .input('observations', params.observations || null)
    .execute('spPurchaseCreate');

  return result.recordset[0];
}

/**
 * Updates an existing purchase record.
 * Handles concurrency control via version check.
 */
export async function purchaseUpdate(params: PurchaseUpdateRequest): Promise<{ version: number }> {
  const pool = await getPool();

  // BR-001: Recalculate total value automatically
  const totalValue = Number((params.unitPrice * params.quantity).toFixed(2));

  const result = await pool
    .request()
    .input('id', params.id)
    .input('idAccount', params.idAccount)
    .input('name', params.name)
    .input('category', params.category)
    .input('purchaseDate', params.purchaseDate)
    .input('unitPrice', params.unitPrice)
    .input('quantity', params.quantity)
    .input('unitMeasure', params.unitMeasure)
    .input('totalValue', totalValue)
    .input('currency', params.currency)
    .input('location', params.location || null)
    .input('observations', params.observations || null)
    .input('version', params.version)
    .execute('spPurchaseUpdate');

  return result.recordset[0];
}

/**
 * Logically deletes a purchase record.
 * Handles concurrency control via version check.
 */
export async function purchaseDelete(params: {
  id: number;
  idAccount: number;
  version: number;
}): Promise<void> {
  const pool = await getPool();

  await pool
    .request()
    .input('id', params.id)
    .input('idAccount', params.idAccount)
    .input('version', params.version)
    .execute('spPurchaseDelete');
}

/**
 * Retrieves a single purchase record by ID.
 */
export async function purchaseGet(params: {
  id: number;
  idAccount: number;
}): Promise<PurchaseEntity | null> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('id', params.id)
    .input('idAccount', params.idAccount)
    .execute('spPurchaseGet');

  return result.recordset[0] || null;
}

/**
 * Lists purchase records with filtering and pagination.
 * Returns metadata including total value of filtered records.
 */
export async function purchaseList(params: PurchaseListFilters): Promise<PurchaseListResponse> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('startDate', params.startDate || null)
    .input('endDate', params.endDate || null)
    .input('category', params.category || null)
    .input('name', params.name || null)
    .input('status', params.status || 'ativo')
    .input('page', params.page || 1)
    .input('pageSize', params.pageSize || 10)
    .input('orderBy', params.orderBy || 'date_desc')
    .execute('spPurchaseList');

  const data = result.recordset;
  const total = data.length > 0 ? data[0].totalCount : 0;
  const totalValue = data.length > 0 ? data[0].totalValueFiltered : 0;

  // Remove metadata columns from data objects to clean up response
  const cleanData = data.map((item: any) => {
    const { totalCount, totalValueFiltered, ...rest } = item;
    return rest;
  });

  return {
    data: cleanData,
    metadata: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      total,
      totalValue,
    },
  };
}
