"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

const DropdownMenuPortal: FC<ComponentProps<typeof DropdownMenuPrimitive.Portal>> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

export default DropdownMenuPortal
