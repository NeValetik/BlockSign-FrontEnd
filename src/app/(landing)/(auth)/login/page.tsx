import { Metadata } from "next";
import LoginForm from "@/views/LoginForm";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your BlockSign account to access your documents and digital signatures.',
  robots: {
    index: false,
    follow: false,
  },
};

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
