export type FundRequest = {
  requestId: string;
  userId: string;
  amount: number;
  type: "add_money" | "purchase";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  description?: string | null;
};
