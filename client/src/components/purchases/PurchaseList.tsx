import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PurchaseRequest } from "@/types/purchase"

type PurchaseListProps = {
  purchases: PurchaseRequest[]
  userNames: Record<string, string>
  totalUsers: number
  onVote: (requestId: string, vote: "yes" | "no") => Promise<void> | void
}

const PurchaseList = ({ purchases, userNames, totalUsers, onVote }: PurchaseListProps) => {
  if (purchases.length === 0) {
    return (
      <Card className="rounded-2xl border-[#e4d3b6] bg-[#fff8ec] p-6 text-center text-sm text-[#766754] shadow-md shadow-[#7c4f18]/5">
        No purchase proposals yet.
      </Card>
    )
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] py-0 text-[#2c2825] shadow-md shadow-[#7c4f18]/5 ring-1">
      <CardContent className="gap-0 px-0">
        {purchases.map((purchase) => {
          const displayName = userNames[purchase.userId] || purchase.userId

          return (
            <div key={purchase.requestId} className="border-b border-[#eee2cf] bg-white/35 p-4 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-semibold text-[#1c1917]">{displayName}</p>
                  <p className="text-sm text-[#766754]">{new Date(purchase.createdAt).toLocaleString()}</p>
                </div>

                <Badge
                  variant="outline"
                  className={`h-5 rounded-sm px-1.5 py-0 text-[10px] font-mono uppercase tracking-widest ${purchase.status === "approved"
                      ? "border-[#bfe7d1] bg-[#edfaf4] text-[#2d7f5c]"
                      : purchase.status === "rejected"
                        ? "border-[#f4c2c2] bg-[#fff1f1] text-[#a15d5d]"
                        : "border-[#d8c7ad] bg-[#f8f3e8] text-[#6c5a46]"
                    }`}
                >
                  {purchase.status}
                </Badge>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-[#251d17]">₹{purchase.amount}</p>
                  {purchase.description ? <p className="text-sm text-[#766754]">{purchase.description}</p> : null}
                </div>

                {purchase.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      onClick={() => onVote(purchase.requestId, "no")}
                    >
                      <X size={14} className="mr-1" /> No
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#3f7f6f] text-white hover:bg-[#2f625f]"
                      onClick={() => onVote(purchase.requestId, "yes")}
                    >
                      <Check size={14} className="mr-1" /> Yes
                    </Button>
                  </div>
                ) : null}
              </div>

              {purchase.status === "pending" ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#766754]">
                  <span>Votes:</span>
                  <span className="font-semibold text-[#2d7f5c]">Yes {purchase.yesVotes}</span>
                  <span className="font-semibold text-[#a15d5d]">No {purchase.noVotes}</span>
                  <span>({totalUsers} total users)</span>
                </div>
              ) : null}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default PurchaseList
