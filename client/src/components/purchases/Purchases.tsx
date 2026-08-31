import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/context/useAuth"
import PurchaseList from "./PurchaseList"
import PurchaseProposalForm from "./PurchaseProposalForm"

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

export type UserSummary = {
  id: string
  firstname: string
  lastname: string
}

const Purchases = () => {
  const { authData } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [userNames, setUserNames] = useState<Record<string, string>>({})
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  const approvedPurchases = requests.filter((purchase) => purchase.status === "approved")

  useEffect(() => {
    if (!authData?.id) {
      setIsLoading(false)
      return
    }

    let isCancelled = false

    const loadData = async () => {
      try {
        setIsLoading(true)

        const [balanceResponse, requestsResponse, usersResponse] = await Promise.all([
          api.get<{ balance: number }>("/api/fund-balance"),
          api.get<PurchaseRequest[]>(`/api/fund-requests?type=purchase&userId=${authData.id}`),
          api.get<UserSummary[]>("/api/users"),
        ])

        if (isCancelled) return

        const namesById: Record<string, string> = {}
        usersResponse.data.forEach((user) => {
          namesById[user.id] = `${user.firstname} ${user.lastname}`.trim()
        })

        setBalance(balanceResponse.data.balance)
        setUserNames(namesById)
        setRequests(requestsResponse.data)
        setMessage("")
      } catch (error: unknown) {
        if (isCancelled) return
        const err = error as { response?: { data?: { message?: string } } }
        setMessage(err.response?.data?.message || "Unable to load purchase requests.")
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isCancelled = true
    }
  }, [authData?.id])

  const refreshData = async () => {
    if (!authData?.id) return

    try {
      const [balanceResponse, requestsResponse, usersResponse] = await Promise.all([
        api.get<{ balance: number }>("/api/fund-balance"),
        api.get<PurchaseRequest[]>(`/api/fund-requests?type=purchase&userId=${authData.id}`),
        api.get<UserSummary[]>("/api/users"),
      ])

      const namesById: Record<string, string> = {}
      usersResponse.data.forEach((user) => {
        namesById[user.id] = `${user.firstname} ${user.lastname}`.trim()
      })

      setBalance(balanceResponse.data.balance)
      setUserNames(namesById)
      setRequests(requestsResponse.data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setMessage(err.response?.data?.message || "Could not refresh purchase data.")
    }
  }

  const handleSubmit = async (proposal: { title: string; amount: number; note: string }) => {
    if (!authData?.id) {
      setMessage("Please sign in to propose a purchase.")
      return
    }

    if (proposal.amount >= balance) {
      setMessage(`Purchase amount must be less than the current fund balance of ₹${balance}.`)
      return
    }

    try {
      setMessage("")
      await api.post("/api/fund-requests", {
        userId: authData.id,
        type: "purchase",
        amount: proposal.amount,
        description: proposal.note ? `${proposal.title} — ${proposal.note}` : proposal.title,
      })

      await refreshData()
      setIsFormOpen(false)
      setMessage("Purchase proposal submitted. Other members can vote on it now.")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setMessage(err.response?.data?.message || "Could not submit the purchase request.")
    }
  }

  const handleVote = async (requestId: string, vote: "yes" | "no") => {
    if (!authData?.id) {
      setMessage("Please sign in to vote.")
      return
    }

    try {
      setMessage("")
      await api.post(`/api/fund-requests/${requestId}/vote`, {
        uid: authData.id,
        vote,
      })

      await refreshData()
      setMessage("Vote recorded successfully.")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setMessage(err.response?.data?.message || "Could not save your vote.")
    }
  }

  return (
    <section className="space-y-5 p-5 pb-28">

      <div
        onClick={() => setIsFormOpen((open) => !open)}
        className={`flex cursor-pointer justify-center items-center gap-3 rounded-xl bg-[#251d17] p-3 text-[#fff8ec] hover:bg-[#3a2a20] ${isFormOpen ? "hidden" : "flex"}`}
      >
        <Plus size={16} />
        Propose a Purchase
      </div>

      {isFormOpen ? (
        <PurchaseProposalForm balance={balance} onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
      ) : null}

      {message ? <p className="text-sm font-medium text-[#3f7f6f]">{message}</p> : null}

      <section className="w-full space-y-3 pt-2">
        <div className="flex items-end justify-between px-1">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">Approved</p>
            <h3 className="mt-1 text-left text-xl font-black tracking-normal uppercase text-[#251d17]">Purchases</h3>
          </div>
          <span className="text-xs text-[#8b7a65]">{approvedPurchases.length} items</span>
        </div>

        {isLoading ? (
          <p className="text-sm text-[#766754]">Loading purchases...</p>
        ) : (
          <PurchaseList purchases={requests} userNames={userNames} totalUsers={Object.keys(userNames).length} onVote={handleVote} />
        )}
      </section>
    </section>
  )
}

export default Purchases