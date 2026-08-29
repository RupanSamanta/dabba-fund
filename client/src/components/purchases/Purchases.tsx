import { useState } from "react"
import { Check, ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ApprovedPurchase = {
  id: number
  title: string
  amount: number
  note?: string
  approvedAt: string
}

const initialApprovedPurchases: ApprovedPurchase[] = [
  {
    id: 1,
    title: "Groceries",
    amount: 420,
    note: "Weekly kitchen essentials",
    approvedAt: "Today",
  },
  {
    id: 2,
    title: "Tea & snacks",
    amount: 180,
    note: "Office pantry restock",
    approvedAt: "Yesterday",
  },
]

const Purchases = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [approvedPurchases, setApprovedPurchases] = useState(initialApprovedPurchases)
  const [proposal, setProposal] = useState({
    title: "",
    amount: "",
    note: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = proposal.title.trim()
    const amount = Number(proposal.amount)

    if (!title || !amount || amount <= 0) {
      return
    }

    setApprovedPurchases((current) => [
      {
        id: Date.now(),
        title,
        amount,
        note: proposal.note.trim() || undefined,
        approvedAt: "Just now",
      },
      ...current,
    ])

    setProposal({ title: "", amount: "", note: "" })
    setIsFormOpen(false)
  }

  return (
    <section className="space-y-5 p-5 pb-28 ">
      <div
          onClick={() => setIsFormOpen((open) => !open)}
          className={`bg-[#251d17] text-[#fff8ec] rounded-xl hover:bg-[#3a2a20] justify-center items-center gap-3 p-3 ${isFormOpen ? 'hidden' : 'flex'}`}
        >
          <Plus size={16} />
          Propose a Purchase
      </div>

      {isFormOpen && (
        <Card className="overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] shadow-md shadow-[#7c4f18]/5 ring-1 py-0">
          <CardHeader className="px-5 pb-2 pt-5">
            <CardTitle className="text-left text-xl font-black tracking-normal text-[#251d17] uppercase">
              New proposal
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-left">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#766754]">
                  What is it?
                </span>
                <input
                  type="text"
                  value={proposal.title}
                  onChange={(event) => setProposal((current) => ({ ...current, title: event.target.value }))}
                  placeholder="e.g. Groceries"
                  className="w-full rounded-xl border border-[#e4d3b6] bg-white/80 px-3 py-2.5 text-base text-[#251d17] outline-none transition placeholder:text-[#a39280] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                />
              </label>

              <label className="block text-left">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#766754]">
                  Amount
                </span>
                <input
                  type="number"
                  min="1"
                  value={proposal.amount}
                  onChange={(event) => setProposal((current) => ({ ...current, amount: event.target.value }))}
                  placeholder="0"
                  className="w-full rounded-xl border border-[#e4d3b6] bg-white/80 px-3 py-2.5 text-base text-[#251d17] outline-none transition placeholder:text-[#a39280] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                />
              </label>

              <label className="block text-left">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#766754]">
                  Note (optional)
                </span>
                <textarea
                  value={proposal.note}
                  onChange={(event) => setProposal((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Add a quick detail"
                  rows={3}
                  className="w-full rounded-xl border border-[#e4d3b6] bg-white/80 px-3 py-2.5 text-base text-[#251d17] outline-none transition placeholder:text-[#a39280] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                />
              </label>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false)
                    setProposal({ title: "", amount: "", note: "" })
                  }}
                  className="flex-1 border-[#d8c7ad] bg-transparent text-[#2c2825] hover:bg-[#f8f3e8]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#251d17] text-[#fff8ec] hover:bg-[#3a2a20]">
                  Propose
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <section className="w-full space-y-3 pt-2">
        <div className="flex items-end justify-between px-1">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">Approved</p>
            <h3 className="mt-1 text-left text-xl font-black tracking-normal uppercase text-[#251d17]">Purchases</h3>
          </div>
          <span className="text-xs text-[#8b7a65]">{approvedPurchases.length} items</span>
        </div>

        <Card className="gap-0 overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] py-0 text-[#2c2825] shadow-md shadow-[#7c4f18]/5 ring-1">
          <CardContent className="gap-0 px-0">
            {approvedPurchases.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e7d4] text-xl text-[#b08238]">
                  <ClipboardList size={20} />
                </div>
                <p className="text-lg font-bold text-[#251d17]">No approved purchases</p>
                <p className="max-w-xs text-sm text-[#766754]">
                  Propose a purchase and it will show up here once approved.
                </p>
              </div>
            ) : (
              approvedPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between border-b border-[#eee2cf] bg-white/35 p-4 transition-colors last:border-b-0 hover:bg-[#f3e7d4]"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#1c1917]">{purchase.title}</p>
                      <Badge
                        variant="outline"
                        className="h-5 rounded-sm border-[#d8c7ad] bg-[#f8f3e8] px-1.5 py-0 text-[10px] font-mono uppercase tracking-widest text-[#6c5a46]"
                      >
                        <span className="flex items-center gap-1">
                          <Check size={10} /> Approved
                        </span>
                      </Badge>
                    </div>
                    {purchase.note && <p className="mt-1 text-sm text-[#78716c]">{purchase.note}</p>}
                    <p className="mt-1 text-xs text-[#8b7a65]">{purchase.approvedAt}</p>
                  </div>

                  <p className="ml-4 text-xl font-semibold text-[#251d17]">₹{purchase.amount}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  )
}

export default Purchases