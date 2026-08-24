interface ButtonProps {
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const FooterButton = ({ Icon, label, isActive }: ButtonProps) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${isActive ? "font-bold text-white" : "text-gray-400"}`}>
        <Icon strokeWidth={isActive ? 1.5 : 1} />
        <span>{label}</span>
    </div>
  )
}

export default FooterButton