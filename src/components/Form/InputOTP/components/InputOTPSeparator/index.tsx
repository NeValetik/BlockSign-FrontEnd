import { MinusIcon } from "lucide-react"
import { ComponentProps, FC } from "react"

const InputOTPSeparator: FC<ComponentProps<"div">> = ({ 
  ...props 
}) => {
  return (
    <div 
      data-slot="input-otp-separator" 
      role="separator" 
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export default InputOTPSeparator
