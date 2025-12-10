import { Metadata } from "next";
import Container from "@/components/Container";
import VerifyDocumentView from "@/views/VerifyDocumentView";

export const metadata: Metadata = {
  title: 'Verify Document',
  description: 'Verify the authenticity of your documents using blockchain technology. Instantly check if a document has been tampered with or is valid.',
  keywords: ['document verification', 'blockchain verification', 'verify document', 'document authenticity'],
};

const VerifyDocumentPage = () => {
  return (
    <Container className="md:py-[96px] py-12 lg:px-[340px]" size="md">
      <VerifyDocumentView />
    </Container>
  );
};

export default VerifyDocumentPage;