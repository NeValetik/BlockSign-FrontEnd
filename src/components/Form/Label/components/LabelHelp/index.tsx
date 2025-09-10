"use client"

import { cn } from "@/lib/utils"
import * as LabelPrimitive from "@radix-ui/react-label"
import { ComponentProps, FC } from "react"

const LabelHelp: FC<ComponentProps<typeof LabelPrimitive.Root> & {
  helpText?: string
}> = ({
  className,
  children,
  helpText,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <LabelPrimitive.Root
        data-slot="label-help"
        className={cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </LabelPrimitive.Root>
      {helpText && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {helpText}
        </p>
      )}
    </div>
  )
}

export default LabelHelp
