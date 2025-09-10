import { cn } from "@/utils/cn"
import { Slot } from "@radix-ui/react-slot"
import { ComponentProps, FC } from "react"
import { badgeVariants } from "../../index"

const BadgeSecondary: FC<ComponentProps<"span"> & { asChild?: boolean }> = ({
  className,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge-secondary"
      className={cn(badgeVariants({ variant: "secondary" }), className)}
      {...props}
    />
  )
}

export default BadgeSecondary
