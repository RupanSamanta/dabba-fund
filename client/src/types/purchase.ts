export type PurchaseRequest = {
  requestId: string
  userId: string
  amount: number
  type: "purchase"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  description?: string | null
  purchaseId?: string | null
  yesVotes: number
  noVotes: number
}
