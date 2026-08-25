import type { Contributor } from "@/types/contributor"

export const defaultContributors: Contributor[] = [
  {
    id: "20060107",
    email: "rupan@dabba.fund",
    name: "Rupan",
    fullname: "Rupan Samanta",
    initials: "RU",
    amount: 0,
    isAdmin: true,
    isCurrentUser: false,
    avatarBgColor: "bg-[#b08238] text-white border-2 border-[#b08238]",
    subtext: ""
  },
  {
    id: "20050711",
    email: "souvagyasarkar9@gmail.com",
    name: "Souvagya",
    fullname: "Souvagya Sarkar",
    initials: "SS",
    amount: 50,
    isAdmin: false,
    avatarBgColor: "bg-[#f5fb5d] text-white",
    subtext: ""
  }
];
