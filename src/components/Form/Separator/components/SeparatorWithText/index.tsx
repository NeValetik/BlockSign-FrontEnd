"use client"

import { cn } from "@/utils/cn"
import { FC, ReactNode } from "react"

const SeparatorWithText: FC<{
  className?: string
  children?: ReactNode
  textClassName?: string
}> = ({
  className,
  children,
  textClassName,
  ...props
}) => {
  return (
    <div
      data-slot="separator-with-text"
      className={cn("relative", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className={cn(
          "bg-background px-2 text-muted-foreground",
          textClassName
        )}>
          {children}
        </span>
      </div>
    </div>
  )
}

export default SeparatorWithText
