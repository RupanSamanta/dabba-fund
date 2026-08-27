import LedgerList from "./LedgerList"
import { transactions } from "@/data/transactions"

const Ledger = () => {
  return (
    <LedgerList transactions={transactions} />
  )
}

export default Ledger