import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { api } from "@/lib/api"
import { useAuth } from "@/context/useAuth"
import axios from "axios"
import type { FundRequest } from "@/types/request"

const presetAmounts = [10, 20, 30, 50]

const AddToJar = () => {
  const { authData } = useAuth()
  const [selectedAmount, setSelectedAmount] = useState<number>(10)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasPendingRequest, setHasPendingRequest] = useState(false)
  const [message, setMessage] = useState("")

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount

  useEffect(() => {
    if (!authData?.id) {
      return
    }

    let isCancelled = false

    const loadPendingRequest = async () => {
      try {
        const response = await api.get<FundRequest[]>(`/api/fund-requests?userId=${authData.id}`)
        if (!isCancelled) {
          setHasPendingRequest(response.data.some((request) => request.type === "add_money" && request.status === "pending"))
        }
      } catch {
        if (!isCancelled) {
          setHasPendingRequest(false)
        }
      }
    }

    const handleFundUpdated = () => {
      void loadPendingRequest()
    }

    void loadPendingRequest()
    window.addEventListener("fund-updated", handleFundUpdated)

    return () => {
      isCancelled = true
      window.removeEventListener("fund-updated", handleFundUpdated)
    }
  }, [authData?.id])

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setMessage("")
  }

  const handleCustomClick = () => {
    setIsCustom(true)
    setMessage("")
  }

  const handleRequestSubmit = async () => {
    if (!authData?.id) {
      setMessage("Please log in to add to the jar.")
      return
    }

    if (currentAmount <= 0) {
      setMessage("Choose a valid amount.")
      return
    }

    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await api.post("/api/fund-requests", {
        userId: authData.id,
        isAdmin: authData.isAdmin,
        amount: currentAmount,
      })

      setMessage(response.data.message || "Request submitted.")
      setHasPendingRequest(response.data.status === "pending")
      window.dispatchEvent(new Event("fund-updated"))
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined
      setMessage(message || "Something went wrong while submitting your request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Accordion disabled={hasPendingRequest} className="overflow-hidden rounded-2xl border border-[#e4d3b6] bg-[#fff8ec] px-5 shadow-md shadow-[#7c4f18]/5" defaultValue={[]}>
        <AccordionItem value="add-to-jar" className="border-0">
          <AccordionTrigger className="py-4 text-xl font-black tracking-normal text-[#251d17] uppercase hover:no-underline">
            <span>Add to the Jar</span>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="flex flex-col gap-4 pb-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {presetAmounts.map((amount) => {
            const isSelected = !isCustom && selectedAmount === amount

            return (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={[
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                  isSelected
                    ? "border-[#b08238] bg-[#b08238] text-white shadow-sm"
                    : "border-[#e4d3b6] bg-white/70 text-[#2c2825] hover:border-[#b08238] hover:bg-[#f8f3e8]"
                ].join(" ")}
              >
                ₹{amount}
              </button>
            )
          })}

          <button
            type="button"
            onClick={handleCustomClick}
            className={[
              "col-span-2 rounded-xl border px-3 py-2 text-sm font-semibold transition sm:col-span-4",
              isCustom
                ? "border-[#3f7f6f] bg-[#3f7f6f] text-white shadow-sm"
                : "border-[#e4d3b6] bg-white/70 text-[#2c2825] hover:border-[#3f7f6f] hover:bg-[#edf7f5]"
            ].join(" ")}
          >
            Custom
          </button>
        </div>

        {isCustom && (
          <label className="block text-left">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#766754]">
              Custom amount
            </span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-xl border border-[#e4d3b6] bg-white/80 px-3 py-2.5 text-base text-[#251d17] outline-none transition placeholder:text-[#a39280] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
            />
          </label>
        )}

        <Button
          type="button"
          size="lg"
          className="w-full bg-[#251d17] text-[#fff8ec] hover:bg-[#3a2a20]"
          disabled={currentAmount <= 0 || isSubmitting || hasPendingRequest || !authData?.id}
          onClick={handleRequestSubmit}
        >
          {isSubmitting ? "Submitting..." : `Add ₹${currentAmount || 0} to the jar`}
        </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {hasPendingRequest ? (
        <p className="rounded-xl border border-[#d8c7ad] bg-[#f8f3e8] px-3 py-2 text-left text-sm font-medium text-[#766754]">
          You already have a request waiting for approval.
        </p>
      ) : null}
      {message ? (
        <p className="text-left text-sm font-medium text-[#3f7f6f]">{message}</p>
      ) : null}
    </div>
  )
}

export default AddToJar