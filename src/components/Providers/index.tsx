import { FC, ReactNode } from "react";

const Providers: FC<{ children: ReactNode }> = ({ children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Providers;