import type { Transaction } from "@/types/transaction"
import { defaultContributors } from "@/data/contributors"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

interface LedgerListProps {
    transactions: Transaction[];
}

const formatTransactionDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (firstDate: Date, secondDate: Date) =>
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate();

    if (isSameDay(date, today)) {
        return "Today";
    }

    if (isSameDay(date, yesterday)) {
        return "Yesterday";
    }

    return date.toLocaleDateString();
};

const getTransactionTypeLabel = (type: Transaction["type"]) => {
    if (type === "addition") {
        return "Addition";
    }

    if (type === "purchase") {
        return "Purchase";
    }

    return "Withdraw";
};

const LedgerList = ({ transactions }: LedgerListProps) => {
    return (
        <section className="w-full space-y-3 p-5 pb-28">
            <div className="flex items-end justify-between px-1">
                <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">Your activity</p>
                    <h3 className="mt-1 text-left text-xl font-black tracking-normal text-[#251d17]">Transactions</h3>
                </div>
                <span className="text-xs text-[#8b7a65]">{transactions.length} entries</span>
            </div>

            <Card className="gap-0 overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] py-0 text-[#2c2825] shadow-md shadow-[#7c4f18]/5 ring-0">
                <CardContent className="gap-0 px-0">
                    {transactions.map((transaction) => {
                        const contributor = defaultContributors.find(
                            (person) => person.id === transaction.userId
                        );
                        const isAddition = transaction.type === "addition";
                        const amountPrefix = isAddition ? "+" : "-";
                        const amountColor = isAddition ? "text-emerald-700" : "text-red-600";

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between border-b border-[#eee2cf] bg-white/35 p-4 transition-colors last:border-b-0 hover:bg-[#f3e7d4]"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={contributor?.avatarUrl} alt={contributor?.name ?? transaction.userId} />
                                        <AvatarFallback className={contributor?.avatarBgColor || "bg-[#b08238] text-white"}>
                                            {contributor?.initials ?? transaction.userId.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="text-left">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-[#1c1917]">
                                                {contributor?.name ?? transaction.userId}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="h-5 rounded-sm border-[#d8c7ad] bg-[#f8f3e8] px-1.5 py-0 text-[10px] font-mono uppercase tracking-widest text-[#6c5a46]"
                                            >
                                                {getTransactionTypeLabel(transaction.type)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-[#78716c]">
                                            {formatTransactionDate(transaction.date)}
                                        </p>
                                    </div>
                                </div>

                                <p className={`text-xl font-semibold ${amountColor}`}>
                                    {amountPrefix}₹{Math.abs(transaction.amount)}
                                </p>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </section>
    )
}

export default LedgerList
