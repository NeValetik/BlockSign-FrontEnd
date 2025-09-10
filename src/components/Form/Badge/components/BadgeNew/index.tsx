import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { ComponentProps, FC } from "react"

const BadgeNew: FC<ComponentProps<"span"> & { asChild?: boolean }> = ({
  className,
  asChild = false,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge-new"
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden",
        "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white [a&]:hover:from-purple-600 [a&]:hover:to-pink-600",
        className
      )}
      {...props}
    >
      {children || "NEW"}
    </Comp>
  )
}

export default BadgeNew
