"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

const DropdownMenuSub: FC<ComponentProps<typeof DropdownMenuPrimitive.Sub>> = ({
  ...props
}) => {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

export default DropdownMenuSub
