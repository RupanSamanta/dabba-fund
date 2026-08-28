import { ArrowUpRight, CircleDollarSign, WalletCards } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { transactions } from "@/data/transactions"
import { useAuth } from "@/context/useAuth"

const Header = () => {
    const { authData } = useAuth()
    const name = authData ? `${authData.firstname} ${authData.lastname}` : "User";
    const initials = `${authData?.firstname[0] ?? "U"}${authData?.lastname[0] ?? ""}`;
    const amount = transactions.reduce((sum, transaction) => {
        const signedAmount = transaction.type === "addition" ? Math.abs(transaction.amount) : -Math.abs(transaction.amount);
        return sum + signedAmount;
    }, 0);
    const raised = transactions
        .filter((transaction) => transaction.type === "addition")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const spent = transactions
        .filter((transaction) => transaction.type === "purchase" || transaction.type === "withdraw")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return (
        <header className="relative w-full overflow-hidden rounded-b-[2rem] bg-[#251d17] px-5 pb-6 pt-5 text-[#fff8ec] shadow-xl shadow-[#251d17]/10 sm:px-7">
            <div className="pointer-events-none absolute -right-10 -top-20 size-48 rounded-full bg-[#d8a03d]/20 blur-3xl" />
            <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#e6c37b] text-[#251d17]">
                        <WalletCards size={18} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold tracking-wide">Dabba Fund</p>
                        <p className="text-[11px] text-[#d7c6a9]">shared wallet</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1 pr-2 text-sm backdrop-blur">
                <Avatar size="sm">
                    <AvatarFallback className="bg-[#3f7f6f] text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate">{name}</span>
                </div>
            </div>
            <div className="relative mt-8 text-left">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#d7c6a9]">
                    <CircleDollarSign size={14} /> Current balance
                </p>
                <h1 className="mt-2 text-5xl font-black tracking-normal">₹{amount}</h1>
                <p className="mt-1 text-sm text-[#d7c6a9]">in the fund right now</p>
                <div className="mt-5 flex gap-5 text-sm">
                    <span className="flex items-center gap-1.5 text-[#e6c37b]"><ArrowUpRight size={15} /> ₹{raised} raised</span>
                    <span className="text-[#cbbca6]">₹{spent} spent</span>
                </div>
            </div>
        </header>
    )
}

export default Header
