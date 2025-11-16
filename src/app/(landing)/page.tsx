'use client'

import { ArrowRight, Shield, FileCheck, Lock } from "lucide-react";
import { motion } from 'framer-motion';
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "../../lib/i18n/client";
import { useUserContext } from "@/contexts/userContext";
import Link from "next/link";

import Container from "@/components/Container";
import Button from "@/components/Form/Button";

const LandingPage = () => {
  const { locale } = useLocale();
  const { t } = useTranslation( locale, [ 'landing', 'common' ] );
  const { me } = useUserContext();
  const isAuthenticated = !!me;

  const features = [
    {
      icon: FileCheck,
      title: t('home.features.verify') || 'Verify documents instantly using blockchain technology',
    },
    {
      icon: Shield,
      title: t('home.features.sign') || 'Digital signatures with legal validity',
    },
    {
      icon: Lock,
      title: t('home.features.secure') || 'Military-grade encryption for your documents',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <Container className="relative py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t('home.title') || 'Secure Document Verification'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('home.subtitle') || 'Blockchain-powered document authentication and digital signatures'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="shadow-glow">
                    <Link href="/documents">
                      {t('nav.documents') || 'Documents'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="shadow-glow" variant="brand">
                      <Link href="/register">
                        {t('home.cta') || 'Get Started'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/login">{t('nav.login') || 'Login'}</Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50">
          <Container>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="p-6 h-full hover:shadow-lg transition-shadow bg-card rounded-lg border border-border">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg">{feature.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
