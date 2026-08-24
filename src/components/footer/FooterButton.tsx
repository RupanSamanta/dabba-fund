interface ButtonProps {
  Icon: React.ElementType;
    label: string;
}

const FooterButton = ({Icon, label} : ButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-2 text-gray-400">
        <Icon strokeWidth="1.5"/>
        <span>{label}</span>
    </div>
  )
}

export default FooterButton