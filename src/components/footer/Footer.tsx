import { ShoppingBag, Wallet } from "lucide-react"
import FooterButton from "./FooterButton"

const Footer = () => {

    const buttonList = [
        { icon: Wallet, label: 'Overview' },
        { icon: ShoppingBag, label: 'Purchases' }
    ];
    
    return (
        <div className="absolute inset-x-0 bottom-0 flex w-full justify-evenly rounded-tl-3xl rounded-tr-3xl bg-[#14233f] p-5 text-sm text-gray-200">
            {buttonList.map((obj) => (
                <FooterButton key={obj.label} Icon={obj.icon} label={obj.label} />
            ))}
        </div>
    )
}

export default Footer