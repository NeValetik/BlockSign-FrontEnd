"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

const DropdownMenuTrigger: FC<ComponentProps<typeof DropdownMenuPrimitive.Trigger>> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

export default DropdownMenuTrigger
