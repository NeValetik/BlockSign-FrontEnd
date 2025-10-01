import { FC, ReactNode } from "react"
import { cn } from "@/utils/cn"

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container: FC<ContainerProps> = ( { children, size = 'lg', ...props } ) => {
  const { className, ...rest } = props;
  
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };
  
  return (
    <div
      className={cn(
        "container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Container;