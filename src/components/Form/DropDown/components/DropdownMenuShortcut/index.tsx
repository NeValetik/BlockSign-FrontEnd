"use client"

import { cn } from "@/utils/cn"
import { ComponentProps, FC } from "react"

const DropdownMenuShortcut: FC<ComponentProps<"span">> = ({
  className,
  ...props
}) => {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export default DropdownMenuShortcut
