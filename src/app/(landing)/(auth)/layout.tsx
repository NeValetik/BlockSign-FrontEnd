import Container from "@/components/Container";
import { FC, ReactNode } from "react";

const AuthLayout:FC<{
  children: ReactNode;
}> = ({
  children,
}) =>{
  return (
    <Container 
      className="
        flex flex-col 
        md:py-[156px] py-12 
        md:w-[724px]
      "
    >
      {children}
    </Container>
  );
}

export default AuthLayout;
