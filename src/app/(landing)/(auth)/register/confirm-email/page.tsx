import { Metadata } from "next";
import ConfirmEmailForm from "@/views/ConfirmEmailForm";

export const metadata: Metadata = {
  title: 'Confirm Email',
  description: 'Confirm your email address to complete your BlockSign account registration.',
  robots: {
    index: false,
    follow: false,
  },
};

const ConfirmEmailPage = () => {
  return (
    <div>
      <ConfirmEmailForm />
    </div>
  )
}

export default ConfirmEmailPage;