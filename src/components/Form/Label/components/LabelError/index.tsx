"use client"

import { cn } from "@/lib/utils"
import * as LabelPrimitive from "@radix-ui/react-label"
import { ComponentProps, FC } from "react"

const LabelError: FC<ComponentProps<typeof LabelPrimitive.Root> & {
  errorMessage?: string
}> = ({
  className,
  children,
  errorMessage,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <LabelPrimitive.Root
        data-slot="label-error"
        className={cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          errorMessage && "text-destructive",
          className
        )}
        {...props}
      >
        {children}
      </LabelPrimitive.Root>
      {errorMessage && (
        <p className="text-xs text-destructive leading-relaxed">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default LabelError
