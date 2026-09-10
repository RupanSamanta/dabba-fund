import { useState } from "react"
import { CalendarDays, CircleDollarSign, Mail, MessageSquareWarning, UserRound } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import FeedbackBox from "./FeedbackBox"

interface UserProfileDropdownProps {
    authData: {
        firstname: string;
        lastname: string;
        email: string;
    } | null;
    totalContributed: number;
    joinedDate: string;
};

const UserProfileDropdown = ({ authData, totalContributed, joinedDate }: UserProfileDropdownProps) => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const name = authData ? `${authData.firstname} ${authData.lastname}` : "User";
    const initials = `${authData?.firstname[0] ?? "U"}${authData?.firstname[1] ?? ""}`.toUpperCase();

    return (
        <>
            <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1 pr-2 text-sm text-[#fff8ec] backdrop-blur outline-none hover:bg-white/15">
                <Avatar size="sm">
                    <AvatarFallback className="bg-[#3f7f6f] text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate">{authData?.firstname ?? "User"}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-default gap-2 hover:bg-transparent focus:bg-transparent">
                    <UserRound size={16} className="text-[#b08238]" />
                    <span className="font-bold">{name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-default gap-2 text-[#766754] hover:bg-transparent focus:bg-transparent">
                    <Mail size={16} className="text-[#b08238]" />
                    {authData?.email ?? "Unknown email"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default justify-between hover:bg-transparent focus:bg-transparent">
                    <span className="flex items-center gap-2 text-[#766754]"><CircleDollarSign size={16} className="text-[#b08238]" />Contribution</span>
                    <span className="font-bold">₹{totalContributed}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-default justify-between hover:bg-transparent focus:bg-transparent">
                    <span className="flex items-center gap-2 text-[#766754]"><CalendarDays size={16} className="text-[#b08238]" />Joined</span>
                    <span className="font-bold">{joinedDate}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)} className="cursor-default justify-between hover:bg-transparent focus:bg-transparent">
                    <span className="flex items-center gap-2 text-[#766754]"><MessageSquareWarning size={16} className="text-[#b08238]" />Provide Feedback</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
            <FeedbackBox open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} authData={authData} />
        </>
    )
}

export default UserProfileDropdown