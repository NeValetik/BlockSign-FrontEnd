import { FC, ReactNode } from "react"
import { cn } from "@/utils/cn"

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ( { children, ...props } ) => {
  const { className, ...rest } = props;
  return (
    <div
      className={cn("container mx-auto px-4", className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Container;