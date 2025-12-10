import { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Access and manage your documents on BlockSign.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DocumentsPage() {
  redirect('/account/documents');
}


