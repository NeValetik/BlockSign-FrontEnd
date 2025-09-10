"use client"

import { cn } from "@/lib/utils"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { ComponentProps, FC } from "react"

const SeparatorHorizontal: FC<ComponentProps<typeof SeparatorPrimitive.Root>> = ({
  className,
  decorative = true,
  ...props
}) => {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-horizontal"
      decorative={decorative}
      orientation="horizontal"
      className={cn(
        "bg-border shrink-0 h-px w-full",
        className
      )}
      {...props}
    />
  )
}

export default SeparatorHorizontal
