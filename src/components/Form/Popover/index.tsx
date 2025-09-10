"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ComponentProps, FC } from "react"

// Import components
import PopoverTrigger from "./components/PopoverTrigger"
import PopoverContent from "./components/PopoverContent"
import PopoverAnchor from "./components/PopoverAnchor"

const Popover: FC<ComponentProps<typeof PopoverPrimitive.Root>> = ({
  ...props
}) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
