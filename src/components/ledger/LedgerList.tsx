import type { Transaction } from "@/types/transaction"
import { defaultContributors } from "@/data/contributors"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const LedgerList = ({ transactions }: LedgerListProps) => {
    return (
        <section className="w-full space-y-3 p-5">
            <h3 className="px-1 text-left font-bold tracking-wider text-[#8b8374] uppercase">
                TRANSACTIONS
            </h3>

            <Card className="gap-0 rounded-2xl bg-[#efe7d8] py-0 text-[#2c2825] border shadow-none ring-0">
                <CardContent className="gap-0 px-0">
                    {transactions.map((transaction) => {
                        const contributor = defaultContributors.find(
                            (person) => person.id === transaction.userId
                        );

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between border-b border-[#e2d9c8] bg-[#ebd9c8]/30 p-4 last:border-b-0"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={contributor?.avatarUrl} alt={contributor?.name ?? transaction.userId} />
                                        <AvatarFallback className={contributor?.avatarBgColor || "bg-[#b08238] text-white"}>
                                            {contributor?.initials ?? transaction.userId.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="text-left">
                                        <p className="font-semibold text-[#1c1917]">
                                            {contributor?.name ?? transaction.userId}
                                        </p>
                                        <p className="text-sm text-[#78716c]">
                                            {formatTransactionDate(transaction.date)}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl font-semibold text-[#1c1917]">
                                    ₹{transaction.amount}
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
