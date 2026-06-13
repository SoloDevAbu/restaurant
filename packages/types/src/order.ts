export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItemDetail {
  id: number;
  menuItemId: number;
  itemName: string; // snapshot stored at order time
  quantity: number;
  unitPrice: string;
}

export interface Order {
  id: string; // UUID
  customerId: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string | null;
  status: OrderStatus;
  totalAmount: string;
  deliveryManId: number | null;
  estimatedMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemDetail[];
}

// Admin: place order (customer-facing, no auth)

export interface PlaceOrderItemBody {
  menuItemId: number;
  quantity: number;
}

export interface PlaceOrderBody {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  items: PlaceOrderItemBody[];
}

// Admin: update order status

export interface UpdateOrderStatusBody {
  status: OrderStatus;
  deliveryManId?: number;
  estimatedMinutes?: number;
}

// Admin: orders query

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  date?: string;
  search?: string;
}

export interface OrdersListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}
