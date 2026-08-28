import { useEffect, useState } from "react";
import LedgerList from "./LedgerList";
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

  return <LedgerList transactions={transactions} />;
};

export default Ledger;
