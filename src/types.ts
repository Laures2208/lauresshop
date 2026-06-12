export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  balance: number;
  email?: string;
  phone?: string;
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

