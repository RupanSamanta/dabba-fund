import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useAuth } from "@/context/useAuth"
import RequestCard from "./RequestCard"
import RequestsHeader from "./RequestsHeader"
import type { Contributor } from "@/types/contributor"
import type { FundRequest } from "../../types/request"

const Requests = () => {
    const { authData } = useAuth()
    const isAdmin = Boolean(authData?.isAdmin)
    const [requests, setRequests] = useState<FundRequest[]>([])
    const [userNames, setUserNames] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!authData?.id) {
            return
        }

        let isCancelled = false

        const loadData = async () => {
            try {
                setIsLoading(true)

                const requestsPromise = api.get<FundRequest[]>(
                    isAdmin
                        ? `/api/fund-requests?isAdmin=true&adminId=${authData.id}`
                        : `/api/fund-requests?userId=${authData.id}`
                )

                const usersPromise = isAdmin ? api.get<Contributor[]>("/api/users") : Promise.resolve({ data: [] as Contributor[] })

                const [requestsResponse, usersResponse] = await Promise.all([requestsPromise, usersPromise])

                if (isCancelled) return

                const namesById: Record<string, string> = {}
                usersResponse.data.forEach((user) => {
                    namesById[user.id] = `${user.firstname} ${user.lastname}`.trim()
                })

                setUserNames(namesById)
                setRequests(requestsResponse.data)
                setMessage("")
            } catch (error: unknown) {
                if (isCancelled) return

                const err = error as { response?: { data?: { message?: string } } }
                setMessage(err.response?.data?.message || "Unable to load request data.")
            } finally {
                if (!isCancelled) {
                    setIsLoading(false)
                }
            }
        }

        void loadData()

        return () => {
            isCancelled = true
        }
    }, [authData?.id, isAdmin])

    const handleDecision = async (requestId: string, action: "approve" | "reject") => {
        if (!authData?.id || !isAdmin) return

        try {
            setMessage("")
            await api.post(`/api/fund-requests/${requestId}/decision`, {
                adminId: authData.id,
                action,
            })

            setMessage(action === "approve" ? "Request approved." : "Request rejected.")

            const [usersResponse, requestsResponse] = await Promise.all([
                api.get<Contributor[]>("/api/users"),
                api.get<FundRequest[]>(`/api/fund-requests?isAdmin=true&adminId=${authData.id}`),
            ])

            const namesById: Record<string, string> = {}
            usersResponse.data.forEach((user) => {
                namesById[user.id] = `${user.firstname} ${user.lastname}`.trim()
            })

            setUserNames(namesById)
            setRequests(requestsResponse.data)
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            setMessage(err.response?.data?.message || "Could not update this request.")
        }
    }

    return (
        <div className="w-full space-y-5 p-5 pb-28">
            <RequestsHeader count={requests.length} isAdmin={isAdmin} />

            <Card className="overflow-hidden rounded-2xl border-[#e4d3b6] bg-[#fff8ec] shadow-md shadow-[#7c4f18]/5 ring-1 py-0">
                <CardContent className="space-y-3 px-5 py-5">
                    {message ? <p className="text-sm font-medium text-[#3f7f6f]">{message}</p> : null}

                    {isLoading ? (
                        <p className="text-sm text-[#766754]">Loading requests...</p>
                    ) : requests.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#d9c7a4] bg-white/40 p-5 text-center text-sm text-[#766754]">
                            {isAdmin ? "No pending fund requests." : "You have not submitted any fund requests yet."}
                        </div>
                    ) : (
                        requests.map((request) => (
                            <RequestCard
                                key={request.requestId}
                                request={request}
                                userName={userNames[request.userId] || `${authData?.firstname ?? ""} ${authData?.lastname ?? ""}`.trim() || request.userId}
                                onDecision={isAdmin ? handleDecision : undefined}
                            />
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Requests
