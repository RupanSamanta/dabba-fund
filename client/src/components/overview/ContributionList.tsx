import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Contributor } from "@/types/contributor"

interface ContributionListType {
    contributors: Contributor[];
    currentContributorId?: string;
}

export const ContributionList = ({ contributors, currentContributorId } : ContributionListType) => {
    const title = "WHO'S PUT IN WHAT";

    return (
        <div className="w-full space-y-3 p-5 pb-28">
            {/* Section Header */}
            <div className="flex items-end justify-between px-1">
                <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">The Circle</p>
                    <h3 className="mt-1 text-left text-xl font-black tracking-normal uppercase text-[#251d17]">{title}</h3>
                </div>
                <span className="text-xs text-[#8b7a65]">{contributors.length} entries</span>
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
                                    <AvatarFallback className={"bg-[#b08238] text-white"}>
                                        {person.firstname[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-base text-[#1c1917]">
                                            {person.firstname}
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
                                </div>
                            </div>

                            {/* Right Side: Currency Amount */}
                            <div className="text-xl font-semibold text-[#1c1917]">
                                {"₹"}
                                {person.amount}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default ContributionList;
