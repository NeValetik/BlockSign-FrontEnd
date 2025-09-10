"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ComponentProps, FC } from "react"

const DropdownMenuRadioGroup: FC<ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>> = ({
  ...props
}) => {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

export default DropdownMenuRadioGroup
