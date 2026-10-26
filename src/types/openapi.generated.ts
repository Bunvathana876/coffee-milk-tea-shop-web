/**
 * AUTO-GENERATED FILE — DO NOT EDIT MANUALLY.
 * Source: FastAPI OpenAPI Specification (Coffee & Milk Tea Shop API v1.0.0)
 * Regenerate with: npm run generate:api
 */

export interface AdminOrderListResponse {
  items: OrderResponse[];
  total: number;
  limit: number;
  offset: number;
  counts_by_status: Record<string, number>;
}

export interface CategoryAdminCreate {
  name: string;
  description?: string | null;
  image?: string | null;
  is_active?: boolean;
}

export interface CategoryAdminResponse {
  /** Category name, e.g. Coffee, Milk Tea */
  name: string;
  /** Description of the category */
  description?: string | null;
  /** Image URL representing the category */
  image?: string | null;
  /** Whether the category is actively displayed */
  is_active?: boolean;
  id: number;
  created_at: string;
  /** Total number of products in this category */
  product_count?: number | null;
  available_product_count?: number;
}

export interface CategoryAdminUpdate {
  name?: string | null;
  description?: string | null;
  image?: string | null;
  is_active?: boolean | null;
}

export interface CategoryDetailResponse {
  /** Category name, e.g. Coffee, Milk Tea */
  name: string;
  /** Description of the category */
  description?: string | null;
  /** Image URL representing the category */
  image?: string | null;
  /** Whether the category is actively displayed */
  is_active?: boolean;
  id: number;
  created_at: string;
  /** Total number of products in this category */
  product_count?: number | null;
  /** List of products in this category */
  products?: ProductSummary[];
}

export interface CategoryResponse {
  /** Category name, e.g. Coffee, Milk Tea */
  name: string;
  /** Description of the category */
  description?: string | null;
  /** Image URL representing the category */
  image?: string | null;
  /** Whether the category is actively displayed */
  is_active?: boolean;
  id: number;
  created_at: string;
  /** Total number of products in this category */
  product_count?: number | null;
}

export interface CustomerAuthResponse {
  access_token: string;
  token_type?: string;
  expires_in_minutes: number;
  user: CustomerUserResponse;
}

export interface CustomerLoginRequest {
  /** Phone number or email address */
  identifier: string;
  password: string;
}

export interface CustomerRegisterRequest {
  /** Customer's full name */
  full_name: string;
  /** Customer's phone number */
  phone: string;
  /** Optional email address */
  email?: string | null;
  /** Account password (min 6 chars) */
  password: string;
}

export interface CustomerUpdateRequest {
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  password?: string | null;
}

export interface CustomerUserResponse {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  loyalty_stamps?: number;
  is_active: boolean;
  created_at: string;
  last_login_at?: string | null;
}

export interface DailySalesPoint {
  date: string;
  total_orders: number;
  completed_orders: number;
  active_orders: number;
  cancelled_orders: number;
  completed_sales_usd: number;
  completed_sales_khr: number;
  active_pipeline_usd: number;
}

export interface DashboardSummaryResponse {
  total_orders: number;
  pending_orders: number;
  preparing_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  today_orders_count: number;
  today_completed_orders_count: number;
  today_completed_sales_usd: number;
  today_completed_sales_khr: number;
  today_active_pipeline_usd: number;
  today_active_pipeline_khr: number;
  exchange_rate_khr: number;
  sales_calculation_note: string;
  product_availability: ProductAvailabilitySummary;
  popular_drinks: PopularDrinkItem[];
  recent_orders: OrderResponse[];
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  app: string;
  version: string;
  environment: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in_minutes: number;
  user: StaffUserResponse;
}

export interface OrderCreate {
  /** Customer name */
  customer_name: string;
  /** Customer phone number */
  customer_phone: string;
  /** List of drinks ordered (cart must contain between 1 and 50 items) */
  items: OrderItemCreate[];
}

export interface OrderItemCreate {
  /** Product ID from the database */
  product_id: number;
  /** Quantity of drinks, must be between 1 and 50 */
  quantity: number;
  /** Cup size: Small, Medium, Large */
  size: string;
  /** Sugar level: 0%, 25%, 50%, 75%, 100% */
  sugar_level: string;
  /** Ice level: No Ice, Less Ice, Normal Ice, Extra Ice */
  ice_level: string;
  /** Selected toppings: Brown Sugar Pearls, Cheese Foam, Coconut Jelly, Pudding */
  toppings?: string[];
  product_name?: string | null;
  unit_price_usd?: number | null;
  subtotal_usd?: number | null;
}

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id?: number | null;
  product_name: string;
  quantity: number;
  unit_price_usd: number;
  subtotal_usd: number;
  size: string;
  sugar_level: string;
  ice_level: string;
  toppings?: string;
}

export interface OrderResponse {
  id: number;
  order_id?: number | null;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  subtotal_usd: number;
  total_usd: number;
  total_khr: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  items?: OrderItemResponse[];
}

export interface OrderStatusUpdateRequest {
  /** New order status: pending, preparing, completed, cancelled */
  order_status: string;
}

export interface PeriodSummary {
  period_label: string;
  orders_count: number;
  completed_orders_count: number;
  completed_sales_usd: number;
  completed_sales_khr: number;
}

export interface PopularDrinkItem {
  product_id?: number | null;
  product_name: string;
  total_quantity_sold: number;
  order_count: number;
  order_value_usd: number;
  order_value_khr: number;
}

export interface ProductAdminCreate {
  name: string;
  category_id: number;
  description?: string | null;
  image?: string | null;
  base_price_usd: number;
  is_available?: boolean;
}

export interface ProductAdminUpdate {
  name?: string | null;
  category_id?: number | null;
  description?: string | null;
  image?: string | null;
  base_price_usd?: number | null;
  is_available?: boolean | null;
}

export interface ProductAvailabilitySummary {
  total_products: number;
  available_products: number;
  unavailable_products: number;
  total_categories: number;
  active_categories: number;
}

export interface ProductResponse {
  /** Product name, e.g. Iced Latte */
  name: string;
  /** Associated category ID */
  category_id: number;
  /** Product description and ingredients */
  description?: string | null;
  /** Image URL of the beverage */
  image?: string | null;
  /** Base price in USD */
  base_price_usd: number;
  /** Whether the drink is currently in stock/available */
  is_available?: boolean;
  id: number;
  created_at: string;
  /** Name of the parent category */
  category_name?: string | null;
  /** Full category details */
  category?: CategoryResponse | null;
}

export interface ProductSummary {
  id: number;
  name: string;
  description?: string | null;
  base_price_usd: number;
  image?: string | null;
  is_available: boolean;
}

export interface SalesReportResponse {
  date_from: string;
  date_to: string;
  exchange_rate_khr: number;
  calculation_policy: string;
  summary: SalesReportSummary;
  weekly_summary: PeriodSummary;
  monthly_summary: PeriodSummary;
  daily_breakdown: DailySalesPoint[];
  status_breakdown: StatusBreakdownItem[];
  product_performance: PopularDrinkItem[];
}

export interface SalesReportSummary {
  total_orders: number;
  completed_orders: number;
  active_orders: number;
  cancelled_orders: number;
  completed_sales_usd: number;
  completed_sales_khr: number;
  active_pipeline_usd: number;
  active_pipeline_khr: number;
  cancelled_value_usd: number;
  average_completed_order_usd: number;
}

export interface StaffCreateRequest {
  email: string;
  full_name: string;
  password: string;
  /** Role must be 'admin' or 'staff' */
  role?: string;
  is_active?: boolean;
}

export interface StaffLoginRequest {
  /** Staff email address */
  email: string;
  /** Staff password */
  password: string;
}

export interface StaffUpdateRequest {
  full_name?: string | null;
  role?: string | null;
  is_active?: boolean | null;
  password?: string | null;
}

export interface StaffUserResponse {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string | null;
}

export interface StatusBreakdownItem {
  status: string;
  order_count: number;
  total_usd: number;
  total_khr: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export const OPENAPI_ENDPOINTS = {
  root__get: { method: "GET", path: "/" },
  login_staff_api_admin_auth_login_post: { method: "POST", path: "/api/admin/auth/login" },
  get_me_api_admin_auth_me_get: { method: "GET", path: "/api/admin/auth/me" },
  list_admin_categories_api_admin_categories_get: { method: "GET", path: "/api/admin/categories" },
  create_admin_category_api_admin_categories_post: { method: "POST", path: "/api/admin/categories" },
  update_admin_category_api_admin_categories__category_id__patch: { method: "PATCH", path: "/api/admin/categories/{category_id}" },
  delete_admin_category_api_admin_categories__category_id__delete: { method: "DELETE", path: "/api/admin/categories/{category_id}" },
  get_dashboard_summary_api_admin_dashboard_summary_get: { method: "GET", path: "/api/admin/dashboard/summary" },
  list_orders_api_admin_orders_get: { method: "GET", path: "/api/admin/orders" },
  get_order_detail_api_admin_orders__order_id__get: { method: "GET", path: "/api/admin/orders/{order_id}" },
  patch_order_status_api_admin_orders__order_id__status_patch: { method: "PATCH", path: "/api/admin/orders/{order_id}/status" },
  list_admin_products_api_admin_products_get: { method: "GET", path: "/api/admin/products" },
  create_admin_product_api_admin_products_post: { method: "POST", path: "/api/admin/products" },
  update_admin_product_api_admin_products__product_id__patch: { method: "PATCH", path: "/api/admin/products/{product_id}" },
  delete_admin_product_api_admin_products__product_id__delete: { method: "DELETE", path: "/api/admin/products/{product_id}" },
  get_sales_report_api_admin_reports_sales_get: { method: "GET", path: "/api/admin/reports/sales" },
  list_staff_accounts_api_admin_staff_get: { method: "GET", path: "/api/admin/staff" },
  create_staff_account_api_admin_staff_post: { method: "POST", path: "/api/admin/staff" },
  update_staff_account_api_admin_staff__staff_id__patch: { method: "PATCH", path: "/api/admin/staff/{staff_id}" },
  login_customer_account_api_auth_login_post: { method: "POST", path: "/api/auth/login" },
  get_my_customer_profile_api_auth_me_get: { method: "GET", path: "/api/auth/me" },
  update_my_customer_profile_api_auth_me_patch: { method: "PATCH", path: "/api/auth/me" },
  register_customer_account_api_auth_register_post: { method: "POST", path: "/api/auth/register" },
  get_categories_api_categories_get: { method: "GET", path: "/api/categories" },
  get_category_by_id_api_categories__category_id__get: { method: "GET", path: "/api/categories/{category_id}" },
  health_check_api_health_get: { method: "GET", path: "/api/health" },
  create_new_order_api_orders_post: { method: "POST", path: "/api/orders" },
  get_orders_by_customer_phone_api_orders_lookup_phone_get: { method: "GET", path: "/api/orders/lookup/phone" },
  get_order_by_number_api_orders_ref__order_number__get: { method: "GET", path: "/api/orders/ref/{order_number}" },
  get_order_by_id_api_orders__id__get: { method: "GET", path: "/api/orders/{id}" },
  get_products_api_products_get: { method: "GET", path: "/api/products" },
  get_product_by_id_api_products__product_id__get: { method: "GET", path: "/api/products/{product_id}" },
} as const;
