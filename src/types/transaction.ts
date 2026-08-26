export interface Transaction {
    id: string;
    type: "addition" | "purchase" | "withdraw";
    amount: number;
    userId: string;
    date: Date;
}
