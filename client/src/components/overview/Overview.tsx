import { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth"
import { api } from "@/lib/api";
import ContributionList from "./ContributionList"
import type { Contributor } from "@/types/contributor";
import { Card } from "@/components/ui/card";
import { Spinner } from "../ui/spinner";

const Overview = () => {
    const { authData } = useAuth();
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContributors = async () => {
            setIsLoading(true);
            const result = await api.get<Contributor[]>("/api/users");
            setContributors(result.data);
            setIsLoading(false);
        }
        fetchContributors();
    }, []);
    return (
        
        <div className="w-full space-y-3 p-5 pb-28">
            <div className="flex items-end justify-between px-1">
                <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">The Circle</p>
                    <h3 className="mt-1 text-left text-xl font-black tracking-normal uppercase text-[#251d17]">WHO'S PUT IN WHAT</h3>
                </div>
                <span className="text-xs text-[#8b7a65]">{contributors.length} members</span>
            </div>
            <Card className="m-auto gap-0 overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] text-[#2c2825] py-0 shadow-md shadow-[#7c4f18]/5">
                {isLoading ? (
                    <div className="flex gap-3 h-20 items-center justify-center text-sm text-[#766754]">
                        <Spinner /> Loading...
                    </div>
                ) : (
                    <ContributionList contributors={contributors} currentContributorId={authData?.id ?? ""} />
                )}
            </Card>
        </div>
    )
}

export default Overview