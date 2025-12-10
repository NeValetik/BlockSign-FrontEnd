import { Metadata } from "next";
import RegisterIdentityForm from "@/views/RegisterIdentityForm";

export const metadata: Metadata = {
  title: 'Identity Verification',
  description: 'Verify your identity to complete your BlockSign registration and enable document signing capabilities.',
  robots: {
    index: false,
    follow: false,
  },
};

const RegisterIdentityPage = () => {
  return (
    <div>
      <RegisterIdentityForm />
    </div>
  );
}

export default RegisterIdentityPage;
