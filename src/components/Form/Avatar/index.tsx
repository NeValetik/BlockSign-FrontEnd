"use client"

import { ComponentProps, FC } from "react"
import { Root } from "@radix-ui/react-avatar"

import { cn } from "@/utils/cn"

const Avatar:FC<ComponentProps<typeof Root>> = ({
  className,
  ...props
}) => {
  return (
    <Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

export default Avatar
