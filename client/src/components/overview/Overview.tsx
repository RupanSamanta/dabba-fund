import { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth"
import { api } from "@/lib/api";
import ContributionList from "./ContributionList"
import type { Contributor } from "@/types/contributor";

const Overview = () => {
    const { authData } = useAuth();
    const [contributors, setContributors] = useState<Contributor[]>([]);

    useEffect(() => {
        const fetchContributors = async () => {
            const result = await api.get<Contributor[]>("/api/users");
            setContributors(result.data);
        }
        fetchContributors();
    }, []);
    return (
        <ContributionList contributors={contributors} currentContributorId={authData?.id??""} />
    )
}

export default Overview