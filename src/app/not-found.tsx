'use client';

import { motion } from 'framer-motion';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import Container from '@/components/Container';
import Button from '@/components/Form/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Container className="flex-1 flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="flex justify-center">
            <Shield className="h-24 w-24 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="brand">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFoundPage;

