"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ComponentProps, FC } from "react"

const PopoverTrigger: FC<ComponentProps<typeof PopoverPrimitive.Trigger>> = ({
  ...props
}) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

export default PopoverTrigger
