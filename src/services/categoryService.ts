import { getCategories, request } from './api';
import type { Category } from '../types';

export { getCategories };

export async function fetchCategories(activeOnly: boolean = true): Promise<Category[]> {
  return getCategories(activeOnly);
}

export async function fetchCategoryById(id: number): Promise<Category> {
  return request<Category>(`/api/categories/${id}`);
}
