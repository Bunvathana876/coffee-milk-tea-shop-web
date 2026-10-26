import { getProducts, getProductById, type ProductFilters } from './api';

import type { Product } from '../types';

export { getProducts, getProductById, type ProductFilters };

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  return getProducts(filters);
}

export async function fetchProductById(id: number): Promise<Product> {
  return getProductById(id);
}
