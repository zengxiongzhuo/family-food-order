export interface CartItem {
  dishId: string;
  name: string;
  imageUrl: string | null;
  ingredients: string;
  quantity: number;
}

export interface DishWithCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: string;
  cookingMethod: string | null;
  isAvailable: boolean;
  sortOrder: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

export interface OrderWithItems {
  id: string;
  notes: string | null;
  status: string;
  totalItems: number;
  emailSentAt: Date | null;
  createdAt: Date;
  items: {
    id: string;
    dishName: string;
    quantity: number;
    ingredients: string;
  }[];
}
