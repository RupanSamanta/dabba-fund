import { Menu } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }: Menu.Root.Props) {
  return <Menu.Root {...props} />
}

function DropdownMenuTrigger({ className, ...props }: Menu.Trigger.Props) {
  return <Menu.Trigger className={cn(className)} {...props} />
}

function DropdownMenuContent({ className, ...props }: Menu.Popup.Props) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={8} align="end">
        <Menu.Popup
          className={cn(
            "z-50 min-w-64 origin-[var(--transform-origin)] rounded-xl border border-[#e4d3b6] bg-[#fff8ec] p-2 text-[#251d17] shadow-xl shadow-[#251d17]/15 outline-none data-[open]:animate-in data-[closed]:animate-out",
            className
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

function DropdownMenuItem({ className, ...props }: Menu.Item.Props) {
  return (
    <Menu.Item
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-[#f3e7d4]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: Menu.Separator.Props) {
  return <Menu.Separator className={cn("my-2 h-px bg-[#e4d3b6]", className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
