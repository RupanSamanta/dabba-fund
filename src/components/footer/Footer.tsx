import { ShoppingBag, Wallet } from "lucide-react"
import FooterButton from "./FooterButton"

const Footer = () => {
    
    const buttonList = [
        { icon: Wallet, label: 'Overview' },
        { icon: ShoppingBag, label: 'Purchases' }
    ];
    
    return (
        <div className="w-full fixed bottom-0 flex justify-evenly bg-[#14233f] p-5 text-sm text-gray-200 rounded-tl-3xl rounded-tr-3xl">
            {buttonList.map((obj) => (
                <FooterButton key={obj.label} Icon={obj.icon} label={obj.label} />
            ))}
        </div>
    )
}

export default Footer