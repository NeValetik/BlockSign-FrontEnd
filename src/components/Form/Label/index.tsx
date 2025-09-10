"use client"

import { cn } from "@/utils/cn"
import * as LabelPrimitive from "@radix-ui/react-label"
import { ComponentProps, FC } from "react"

// Import components
import LabelRequired from "./components/LabelRequired"
import LabelOptional from "./components/LabelOptional"
import LabelHelp from "./components/LabelHelp"
import LabelError from "./components/LabelError"

const Label: FC<ComponentProps<typeof LabelPrimitive.Root>> = ({
  className,
  ...props
}) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label, LabelRequired, LabelOptional, LabelHelp, LabelError }
