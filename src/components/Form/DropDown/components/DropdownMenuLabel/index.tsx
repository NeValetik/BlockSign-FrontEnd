"use client"

import { cn } from "@/lib/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

const DropdownMenuLabel: FC<ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}> = ({
  className,
  inset,
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

export default DropdownMenuLabel
