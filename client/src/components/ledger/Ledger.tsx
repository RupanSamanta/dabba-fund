import { useEffect, useState } from "react";
import LedgerList from "./LedgerList";
import AddToJar from "./AddToJar";
import type { Transaction } from "@/types/transaction";
import { api } from "@/lib/api";

const Ledger = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await api.get<Transaction[]>("/api/transactions");
      setTransactions(result.data);
    };
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-5 p-5 pb-28">
      <AddToJar />
      <LedgerList transactions={transactions} />
    </div>
  );
};

export default Ledger;