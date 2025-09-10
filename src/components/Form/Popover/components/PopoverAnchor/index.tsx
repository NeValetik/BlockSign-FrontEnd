"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ComponentProps, FC } from "react"

const PopoverAnchor: FC<ComponentProps<typeof PopoverPrimitive.Anchor>> = ({
  ...props
}) => {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export default PopoverAnchor
