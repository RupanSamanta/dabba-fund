import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Contributor } from "@/types/contributor"

interface ContributionListProps {
    title?: string;
    contributors: Contributor[];
    currentContributorId: string | null;
    adminName?: string;
}

export const ContributionList: React.FC<ContributionListProps> = ({
    title = "WHO'S PUT IN WHAT",
    contributors,
    currentContributorId,
    adminName = "Rupan",
}) => {
    return (
        <div className="w-full space-y-3 p-5 pb-28">
            {/* Section Header */}
            <div className="px-1 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">The circle</p>
                <h3 className="mt-1 text-xl font-black tracking-normal text-[#251d17]">{title}</h3>
            </div>

            {/* Main Container Card */}
            <Card className="m-auto gap-0 overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] text-[#2c2825] py-0 shadow-md shadow-[#7c4f18]/5">
                <CardContent className="p-0 divide-y divide-[#e2d9c8] gap-0">
                    {contributors.map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center justify-between border-b border-[#eee2cf] bg-white/35 p-4 py-5 transition-colors last:border-b-0 hover:bg-[#f3e7d4]"
                        >
                            {/* Left Side: Avatar + Details */}
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={person.avatarUrl} alt={person.name} />
                                    <AvatarFallback className={person.avatarBgColor || "bg-[#b08238] text-white"}>
                                        {person.initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-base text-[#1c1917]">
                                            {person.name}
                                            {person.id === currentContributorId && (
                                                <span className="font-normal text-[#44403c] ml-1">(you)</span>
                                            )}
                                        </span>

                                        {person.isAdmin && (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] tracking-widest font-mono border-[#b08238] text-[#855b17] bg-transparent py-0 px-1.5 h-4 uppercase rounded-sm"
                                            >
                                                ADMIN
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Optional Subtext line (e.g., status/cursor marker) */}
                                    {person.subtext && (
                                        <span className="text-xs text-[#78716c] font-mono leading-none mt-1">
                                            {person.subtext}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Currency Amount */}
                            <div className="text-xl font-semibold text-[#1c1917]">
                                {person.currencySymbol || "₹"}
                                {person.amount}
                            </div>
                        </div>
                    ))}
                </CardContent>

                {/* Dynamic Footer */}
                <CardFooter className="p-4 pt-3 text-sm text-[#78716c] border-t border-[#e2d9c8]/60">
                    New face? Ask {adminName} to add them.
                </CardFooter>
            </Card>
        </div>
    );
};

export default ContributionList;
