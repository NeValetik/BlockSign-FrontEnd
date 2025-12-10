import { Metadata } from "next";
import RegisterForm from "@/views/RegisterForm";

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new BlockSign account to start using blockchain-powered document verification and digital signatures.',
  robots: {
    index: false,
    follow: false,
  },
};

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
