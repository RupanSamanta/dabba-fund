import { ArrowDownRight, ArrowUpRight, WalletCards } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useAuth } from "@/context/useAuth"
import { api } from "@/lib/api"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import type { Transaction } from "@/types/transaction"

const Header = () => {
    const { authData } = useAuth();
    const location = useLocation();
    const name = authData ? `${authData.firstname} ${authData.lastname}` : "User";
    const initials = `${authData?.firstname[0] ?? "U"}${authData?.firstname[1] ?? ""}`.toUpperCase();

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const result = await api.get<Transaction[]>("/api/transactions");
                setTransactions(result.data);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            }
        }

        void fetchTransactions();
    }, [location.pathname]);

    const amount = useMemo(() => transactions.reduce((sum, transaction) => {
        const signedAmount = transaction.type === "addition" ? Math.abs(transaction.amount) : -Math.abs(transaction.amount);
        return sum + signedAmount;
    }, 0), [transactions]);

    const raised = useMemo(() => transactions.filter((transaction) => transaction.type === "addition")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0), [transactions]);

    const spent = useMemo(() => transactions.filter((transaction) => transaction.type === "purchase" || transaction.type === "withdraw")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0), [transactions]);

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
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#d7c6a9]">
                    Current balance
                </p>
                <h1 className="mt-2 text-5xl font-black tracking-normal">₹{amount}</h1>
                <p className="mt-1 text-sm text-[#d7c6a9]">in the fund right now</p>
                <div className="mt-5 flex gap-5 text-sm *:flex *:items-center *:gap-1">
                    <span className="text-[#e6c37b]"><ArrowUpRight size={15} /> ₹{raised} raised</span>
                    <span className="text-[#cbbca6]"><ArrowDownRight size={15} /> ₹{spent} spent</span>
                </div>
            </div>
        </header>
    )
}

export default Header
