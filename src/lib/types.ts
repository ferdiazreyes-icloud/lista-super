export interface ProductWithSelection {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  ubereatsName: string;
  defaultQty: number;
  unit: string;
  notes: string | null;
  sortOrder: number;
  selected: boolean;
  quantity: number;
}

export interface CustomItem {
  id: number;
  listId: number;
  productName: string;
  quantity: number;
  unit: string;
  createdAt: string;
}

export interface ListData {
  list: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
  };
  products: ProductWithSelection[];
  customItems: CustomItem[];
}
