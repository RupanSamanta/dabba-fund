export interface Transaction {
    id: string;
    type: "addition" | "purchase" | "withdraw";
    amount: number;
    name: string;
    time: Date;
}
