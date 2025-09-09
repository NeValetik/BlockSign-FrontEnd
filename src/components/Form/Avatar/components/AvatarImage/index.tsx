import { cn } from "@/lib/utils"
import { Image } from "@radix-ui/react-avatar"
import { ComponentProps, FC } from "react"

export const AvatarImage:FC<
  ComponentProps<typeof Image>> = ({
  className,
  ...props
}) => {
  return (
    <Image
      alt="avatar"
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}