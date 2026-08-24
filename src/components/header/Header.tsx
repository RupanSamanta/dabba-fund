import { Avatar, AvatarFallback } from "../ui/avatar"

const Header = () => {
    const name = "Rupan";
    const amount = 100;
    const raised = 0;
    return (
        <div className="w-full bg-[#14233f] flex justify-between flex-wrap px-7 p-5 text-gray-200 rounded-bl-3xl rounded-br-3xl">
            <h2 className="text-amber-400">DABBA FUND</h2>
            <div className="flex items-center gap-2 text-sm p-1 pr-2 border-[0.05rem] border-gray-300 bg-gray-500/10 rounded-full">
                <Avatar size="sm">
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <span>{name}</span>
            </div>
            <div className="w-full space-y-3 mt-3 font-light text-left">
                <h3 className="text-5xl font-normal">₹{amount}</h3>
                <div>in the fund right now</div>
                <div className="flex gap-5 justify-start text-gray-400 text-lg">
                    <span>₹{raised} raised</span>
                    <span>₹{raised} spent</span>
                </div>
            </div>
        </div>
    )
}

export default Header