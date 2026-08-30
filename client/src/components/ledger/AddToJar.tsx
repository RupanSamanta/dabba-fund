import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useAuth } from "@/context/useAuth"

const presetAmounts = [10, 20, 30, 50]

const AddToJar = () => {
  const { authData } = useAuth()
  const [selectedAmount, setSelectedAmount] = useState<number>(10)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount

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
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Something went wrong while submitting your request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] shadow-md shadow-[#7c4f18]/5 ring-1 py-0">
      <CardHeader className="px-5 pb-2 pt-4">
        <CardTitle className="text-left text-xl font-black tracking-normal text-[#251d17] uppercase">
          Add to the Jar
        </CardTitle>
      </CardHeader>

      <CardContent className="gap-4 px-5 pb-5">
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

        {message ? (
          <p className="text-left text-sm font-medium text-[#3f7f6f]">{message}</p>
        ) : null}

        <Button
          type="button"
          size="lg"
          className="w-full bg-[#251d17] text-[#fff8ec] hover:bg-[#3a2a20]"
          disabled={currentAmount <= 0 || isSubmitting || !authData?.id}
          onClick={handleRequestSubmit}
        >
          {isSubmitting ? "Submitting..." : `Add ₹${currentAmount || 0} to the jar`}
        </Button>
      </CardContent>
    </Card>
  )
}

export default AddToJar