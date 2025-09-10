"use client"

import { cn } from "@/utils/cn"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { ComponentProps, FC } from "react"

// Import components
import SeparatorHorizontal from "./components/SeparatorHorizontal"
import SeparatorVertical from "./components/SeparatorVertical"
import SeparatorWithText from "./components/SeparatorWithText"
import SeparatorDotted from "./components/SeparatorDotted"

const Separator: FC<ComponentProps<typeof SeparatorPrimitive.Root>> = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) => {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator, SeparatorHorizontal, SeparatorVertical, SeparatorWithText, SeparatorDotted }
