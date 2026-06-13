export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  balance: number;
  email?: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: number;
}

export interface AccountProduct {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rank?: string;
  champions?: number;
  skins?: number;
  gameUsername?: string;
  gamePassword?: string;
  categoryId?: string;
  isSold?: boolean;
}

export interface ServicePrices {
  rentPerHour: number;
  boostBasic: number;
  boostStar: number;
  boostCombo1: number;
  boostCombo2: number;
}

export type CartItemType = 'ACCOUNT' | 'SLOT' | 'BOOST';

export interface CartItem {
  id: string;
  type: CartItemType;
  title: string;
  price: number;
  details?: Record<string, unknown>;
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  paymentMethod: 'QR' | 'CARD';
  zaloPhone?: string;
}

