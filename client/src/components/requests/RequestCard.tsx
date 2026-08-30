import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FundRequest } from "../../types/request"

type RequestCardProps = {
  request: FundRequest
  userName?: string
  onDecision?: (requestId: string, action: "approve" | "reject") => Promise<void>
}

const RequestCard = ({ request, userName, onDecision }: RequestCardProps) => {
  const statusClasses = {
    pending: "border-[#d8c7ad] bg-[#f8f3e8] text-[#6c5a46]",
    approved: "border-[#bfe7d1] bg-[#edfaf4] text-[#2d7f5c]",
    rejected: "border-[#f4c2c2] bg-[#fff1f1] text-[#a15d5d]",
  }

  const displayName = userName || request.userId
  const showActions = Boolean(onDecision)

  return (
    <div className="rounded-2xl border border-[#e4d3b6] bg-white/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[#1c1917]">{displayName}</p>
          <p className="text-sm text-[#766754]">{new Date(request.createdAt).toLocaleString()}</p>
        </div>

        <Badge
          variant="outline"
          className={`h-5 rounded-sm px-1.5 py-0 text-[10px] font-mono uppercase tracking-widest ${statusClasses[request.status]}`}
        >
          {request.status}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-black text-[#251d17]">₹{request.amount}</p>
          {request.description ? <p className="text-sm text-[#766754]">{request.description}</p> : null}
        </div>

        {showActions ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              onClick={() => onDecision?.(request.requestId, "reject")}
            >
              Reject
            </Button>
            <Button
              type="button"
              className="bg-[#3f7f6f] text-white hover:bg-[#2f625f]"
              onClick={() => onDecision?.(request.requestId, "approve")}
            >
              Approve
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RequestCard
