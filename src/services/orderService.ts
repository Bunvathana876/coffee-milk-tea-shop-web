import { request } from './api';
import type { CreateOrderPayload, Order } from '../types';

/**
 * Sends a new order payload to the FastAPI backend at POST /api/orders/
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return request<Order>('/api/orders/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches an existing order by its numeric ID
 */
export async function getOrderById(id: number): Promise<Order> {
  return request<Order>(`/api/orders/${id}`);
}

/**
 * Fetches an existing order by its alphanumeric order reference (e.g. ORD-20261008-ABC123)
 */
export async function getOrderByReference(orderNumber: string): Promise<Order> {
  return request<Order>(`/api/orders/ref/${encodeURIComponent(orderNumber)}`);
}

