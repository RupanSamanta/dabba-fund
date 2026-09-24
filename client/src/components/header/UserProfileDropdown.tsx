import { useState } from "react"
import { CalendarDays, CircleDollarSign, Mail, MessageSquareWarning, UserRound, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import FeedbackBox from "./FeedbackBox"

interface UserProfileDropdownProps {
    authData: {
        firstname: string;
        lastname: string;
        email: string;
    } | null;
    logout: () => void;
    totalContributed: number;
    joinedDate: string;
};

const UserProfileDropdown = ({ authData, logout, totalContributed, joinedDate }: UserProfileDropdownProps) => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const name = authData ? `${authData.firstname} ${authData.lastname}` : "User";
    const initials = `${authData?.firstname[0] ?? "U"}${authData?.firstname[1] ?? ""}`.toUpperCase();
    const baseItemClass = "cursor-default hover:bg-transparent focus:bg-transparent";
    const iconClass = "text-[#b08238]";
    const secondaryTextClass = "flex items-center gap-2 text-[#766754]";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="w-fit rounded-full flex items-center gap-2 border border-white/15 bg-white/10 p-1 pr-2 text-sm text-[#fff8ec] backdrop-blur outline-none hover:bg-white/15">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-[#3f7f6f] text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="max-w-28 truncate">{authData?.firstname ?? "User"}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className={`${baseItemClass} gap-2`}>
                        <UserRound size={16} className={iconClass} />
                        <span className="font-bold">{name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={`${baseItemClass} gap-2 ${secondaryTextClass}`}>
                        <Mail size={16} className={iconClass} />
                        {authData?.email ?? "Unknown email"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={`${baseItemClass} justify-between`}>
                        <span className={secondaryTextClass}><CircleDollarSign size={16} className={iconClass} />Contribution</span>
                        <span className="font-bold">₹{totalContributed}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={`${baseItemClass} justify-between`}>
                        <span className={secondaryTextClass}><CalendarDays size={16} className={iconClass} />Joined</span>
                        <span className="font-bold">{joinedDate}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)} className={`${baseItemClass} justify-between`}>
                        <span className={secondaryTextClass}><MessageSquareWarning size={16} className={iconClass} />Provide Feedback</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={`${baseItemClass} justify-between text-[#c8553d]`} onClick={logout}>
                        <span className="flex items-center gap-2"><LogOut size={16} className="text-[#c8553d]" />Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <FeedbackBox open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} authData={authData} />
        </>
    )
}

export default UserProfileDropdown