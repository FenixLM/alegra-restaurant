export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  purchased_at: string;
}

export interface Purchase {
  order_id: string;
  items: PurchaseItem[];
}
