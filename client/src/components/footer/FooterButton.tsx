interface ButtonProps {
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
  hasNotification?: boolean;
}

const FooterButton = ({ Icon, label, isActive, hasNotification = false }: ButtonProps) => {
  return (
    <div className={`relative flex flex-col items-center gap-1.5 rounded-xl px-4 py-1 transition-colors ${isActive ? "font-bold text-[#e6c37b]" : "text-[#9f907b]"}`}>
      <span className="relative">
        <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
        {hasNotification ? <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#e36b4f] ring-2 ring-[#251d17]" aria-label="New request" /> : null}
      </span>
      <span className="text-xs">{label}</span>
    </div>
  )
}

export default FooterButton