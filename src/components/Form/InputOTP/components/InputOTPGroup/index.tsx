import { cn } from "@/lib/utils"
import { ComponentProps, FC } from "react"

const InputOTPGroup: FC<ComponentProps<"div">> = ({ 
  className, 
  ...props 
}) => {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

export default InputOTPGroup
