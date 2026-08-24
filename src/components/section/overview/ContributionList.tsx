import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Contributor } from "@/types/contributor"

interface ContributionListProps {
    title?: string;
    contributors: Contributor[];
    adminName?: string;
}

export const ContributionList: React.FC<ContributionListProps> = ({
    title = "WHO'S PUT IN WHAT",
    contributors,
    adminName = "Arpan",
}) => {
    return (
        <div className="w-full max-w-md space-y-3 font-sans">
            {/* Section Header */}
            <h3 className="text-xs font-bold tracking-wider text-[#8b8374] uppercase px-1">
                {title}
            </h3>

            {/* Main Container Card */}
            <Card className="bg-[#f4efe4] border-[#e2d9c8] text-[#2c2825] shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0 divide-y divide-[#e2d9c8]">
                    {contributors.map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center justify-between p-4 transition-colors hover:bg-[#ebd9c8]/30"
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
                                            {person.isCurrentUser && (
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
                            <div className="text-lg font-semibold text-[#1c1917]">
                                {person.currencySymbol || "₹"}
                                {person.amount}
                            </div>
                        </div>
                    ))}
                </CardContent>

                {/* Dynamic Footer */}
                <CardFooter className="p-4 pt-3 text-sm text-[#78716c] border-t border-[#e2d9c8]/60 bg-[#f4efe4]">
                    New face? Ask {adminName} to add them.
                </CardFooter>
            </Card>
        </div>
    );
};

export default ContributionList;