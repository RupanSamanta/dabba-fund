import { BookOpen, ShoppingBag, Wallet } from "lucide-react"
import { NavLink } from "react-router-dom"
import FooterButton from "./FooterButton"

const Footer = () => {

    const buttonList = [
        { icon: Wallet, label: 'Overview', path: '/' },
        { icon: BookOpen, label: 'Ledger', path: '/ledger' },
        { icon: ShoppingBag, label: 'Purchases', path: '/purchases' }
    ];

    return (
        <div className="absolute inset-x-0 bottom-0 flex w-full justify-evenly rounded-tl-3xl rounded-tr-3xl bg-[#14233f] p-5 text-sm text-gray-200">
            {buttonList.map((obj) => (
                <NavLink key={obj.label} end={obj.label === 'Overview'} to={obj.path} className="flex-1">
                    {({ isActive }) => (
                        <FooterButton Icon={obj.icon} label={obj.label} isActive={isActive} />
                    )}
                </NavLink>
            ))}
        </div>
    )
}

export default Footer