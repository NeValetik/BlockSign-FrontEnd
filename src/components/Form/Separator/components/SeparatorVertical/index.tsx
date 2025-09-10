"use client"

import { cn } from "@/lib/utils"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { ComponentProps, FC } from "react"

const SeparatorVertical: FC<ComponentProps<typeof SeparatorPrimitive.Root>> = ({
  className,
  decorative = true,
  ...props
}) => {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-vertical"
      decorative={decorative}
      orientation="vertical"
      className={cn(
        "bg-border shrink-0 w-px h-full",
        className
      )}
      {...props}
    />
  )
}

export default SeparatorVertical
