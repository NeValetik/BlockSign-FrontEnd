import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, FileCheck, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FileCheck,
      title: t('home.features.verify'),
    },
    {
      icon: Shield,
      title: t('home.features.sign'),
    },
    {
      icon: Lock,
      title: t('home.features.secure'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="container relative py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t('home.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="shadow-glow">
                    <Link to="/documents">
                      {t('nav.documents')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="shadow-glow">
                      <Link to="/register">
                        {t('home.cta')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/login">{t('nav.login')}</Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg">{feature.title}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
