"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

const DropdownMenuGroup: FC<ComponentProps<typeof DropdownMenuPrimitive.Group>> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

export default DropdownMenuGroup
