export type FundRequest = {
  requestId: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  description?: string | null;
};
