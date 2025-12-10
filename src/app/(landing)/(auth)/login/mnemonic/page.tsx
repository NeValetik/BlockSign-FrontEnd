import { Metadata } from "next";
import LoginMnemonicForm from "@/views/LoginMnemonicForm";

export const metadata: Metadata = {
  title: 'Login with Mnemonic',
  description: 'Sign in to your BlockSign account using your mnemonic phrase for secure authentication.',
  robots: {
    index: false,
    follow: false,
  },
};

const LoginMnemonicPage = () => {

  return (
    <div>
      <LoginMnemonicForm />
    </div>
  )
}

export default LoginMnemonicPage;