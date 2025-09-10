import { FC, ReactNode } from "react";

const AuthLayout:FC<{
  children: ReactNode;
}> = ({
  children,
}) =>{
  return (
    <div>
      {children}
    </div>
  );
}

export default AuthLayout;
