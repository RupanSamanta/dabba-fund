export interface Contributor {
    id: string;
    name: string;
    fullname: string;
    initials: string;
    avatarUrl?: string;
    avatarBgColor?: string; // Custom bg color hex or tailwind class
    amount: number;
    currencySymbol?: string;
    isCurrentUser?: boolean;
    isAdmin?: boolean;
    subtext?: string;
}
