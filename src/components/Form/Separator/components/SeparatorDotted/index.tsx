"use client"

import { cn } from "@/lib/utils"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { ComponentProps, FC } from "react"

const SeparatorDotted: FC<ComponentProps<typeof SeparatorPrimitive.Root>> = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) => {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-dotted"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "border-border shrink-0",
        orientation === "horizontal" 
          ? "border-t border-dotted h-0 w-full" 
          : "border-l border-dotted w-0 h-full",
        className
      )}
      {...props}
    />
  )
}

export default SeparatorDotted
