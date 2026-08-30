import { BookOpen, ClipboardList, ShoppingBag, Wallet } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/context/useAuth"
import FooterButton from "./FooterButton"

const Footer = () => {
    const { authData } = useAuth()

    const buttonList = [
        { icon: Wallet, label: 'Overview', path: '/' },
        { icon: BookOpen, label: 'Ledger', path: '/ledger' },
        { icon: ShoppingBag, label: 'Purchases', path: '/purchases' },
        { icon: ClipboardList, label: 'Requests', path: '/requests' },
    ];

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[500px] justify-evenly rounded-t-[2rem] border-t border-[#3b2b20] bg-[#251d17] px-3 pb-5 pt-4 text-sm text-[#cbbca6] shadow-[0_-10px_30px_rgba(37,29,23,0.12)]"
            aria-label="Primary navigation"
        >
            {buttonList.map((obj) => (
                <NavLink key={obj.label} end={obj.label === 'Overview'} to={obj.path} className="flex-1">
                    {({ isActive }) => (
                        <FooterButton Icon={obj.icon} label={obj.label} isActive={isActive} />
                    )}
                </NavLink>
            ))}
        </nav>
    )
}

export default Footer