interface ButtonProps {
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const FooterButton = ({ Icon, label, isActive }: ButtonProps) => {
  return (
    <div className={`flex flex-col items-center gap-1.5 rounded-xl px-4 py-1 transition-colors ${isActive ? "font-bold text-[#e6c37b]" : "text-[#9f907b]"}`}>
      <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
      <span className="text-xs">{label}</span>
    </div>
  )
}

export default FooterButton