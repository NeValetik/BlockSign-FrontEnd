import { cn } from "@/lib/utils"
import { Fallback } from "@radix-ui/react-avatar"
import { ComponentProps, FC } from "react"

const AvatarFallback:FC<
  ComponentProps<typeof Fallback>> = ({
  className,
  ...props
}) => {
  return (
    <Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export default AvatarFallback;