import { BookOpen, ShoppingBag, Wallet } from "lucide-react"
import FooterButton from "./FooterButton"
import { Link } from "react-router";

const Footer = () => {

    const buttonList = [
        { icon: Wallet, label: 'Overview' },
        { icon: BookOpen, label: 'Ledgar' },
        { icon: ShoppingBag, label: 'Purchases' }
    ];
    
    return (
        <div className="absolute inset-x-0 bottom-0 flex w-full justify-evenly rounded-tl-3xl rounded-tr-3xl bg-[#14233f] p-5 text-sm text-gray-200">
            {buttonList.map((obj) => (
                <Link to={`/${obj.label.toLowerCase()}`}>
                    <FooterButton key={obj.label} Icon={obj.icon} label={obj.label} />
                </Link>
            ))}
        </div>
    )
}

export default Footer