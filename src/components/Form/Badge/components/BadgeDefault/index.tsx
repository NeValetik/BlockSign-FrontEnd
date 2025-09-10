import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { ComponentProps, FC } from "react"
import { badgeVariants } from "../../index"

const BadgeDefault: FC<ComponentProps<"span"> & { asChild?: boolean }> = ({
  className,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge-default"
      className={cn(badgeVariants({ variant: "default" }), className)}
      {...props}
    />
  )
}

export default BadgeDefault
