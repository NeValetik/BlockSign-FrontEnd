import { Metadata } from "next";
import Container from "@/components/Container";
import { FC, ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: 'Authentication',
    template: '%s | BlockSign'
  },
  description: 'Sign in or create your BlockSign account to access blockchain-powered document verification and digital signatures.',
  robots: {
    index: false,
    follow: false,
  },
};

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
