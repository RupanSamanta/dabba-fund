import type { Contributor } from "@/types/contributor"

export const defaultContributors: Contributor[] = [
  {
    id: "1",
    name: "Rupan",
    initials: "RU",
    amount: 50,
    isCurrentUser: true,
    avatarBgColor: "bg-[#b08238] text-white border-2 border-[#b08238]",
    subtext: "I",
  },
  {
    id: "2",
    name: "Arpan",
    initials: "AR",
    amount: 0,
    isAdmin: true,
    avatarBgColor: "bg-[#457b5d] text-white",
    subtext: "—",
  },
];