"use client"

import { OTPInput } from "input-otp"
import { cn } from "@/utils/cn"
import { ComponentProps, FC } from "react"

// Import components
import InputOTPGroup from "./components/InputOTPGroup"
import InputOTPSlot from "./components/InputOTPSlot"
import InputOTPSeparator from "./components/InputOTPSeparator"

const InputOTP: FC<
  ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}> = ({
  className,
  containerClassName,
  ...props
}) => {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
