import type { Order } from "./order.js";

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: string;
  pendingOrders: number;
  activeMenuItems: number;
  recentOrders: Order[];
}
