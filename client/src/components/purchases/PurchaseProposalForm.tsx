import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PurchaseProposalFormProps = {
  balance: number
  onSubmit: (proposal: { title: string; amount: number; note: string }) => Promise<void> | void
  onCancel: () => void
}

export const PurchaseProposalForm = ({ balance, onSubmit, onCancel }: PurchaseProposalFormProps) => {
  const [proposal, setProposal] = useState({
    title: "",
    amount: "",
    note: "",
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = proposal.title.trim()
    const amount = Number(proposal.amount)
    const note = proposal.note.trim()

    if (!title || !amount || amount <= 0) {
      return
    }

    if (amount >= balance) {
      return
    }

    await onSubmit({
      title,
      amount,
      note,
    })
  }

  return (
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
              step="0.01"
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
                setProposal({ title: "", amount: "", note: "" })
                onCancel()
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
  )
}

export default PurchaseProposalForm
