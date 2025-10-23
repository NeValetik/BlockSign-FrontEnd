import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    idnp: '',
    birthDate: '',
    selfie: null as File | null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
        toast.error('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    
    setStep(prev => prev + 1);
    
    // Simulate email sending
    if (step === 1) {
      toast.success('Verification code sent to your email');
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await register(formData);
      setStep(5); // Success screen
      setTimeout(() => {
        navigate('/documents');
      }, 5000);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-4"
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{t('nav.register')}</CardTitle>
              <CardDescription>
                Step {step} of 4
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('auth.fullName')}</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.email')}</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.phone')}</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.password')}</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.confirmPassword')}</Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    />
                  </div>
                  <Button onClick={handleNext} className="w-full">
                    {t('common.next')}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('auth.verificationCode')}</Label>
                    <Input
                      maxLength={6}
                      placeholder="000000"
                      value={formData.verificationCode}
                      onChange={(e) => handleChange('verificationCode', e.target.value)}
                    />
                  </div>
                  <Button onClick={handleNext} className="w-full">
                    {t('common.next')}
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('auth.idnp')}</Label>
                    <Input
                      value={formData.idnp}
                      onChange={(e) => handleChange('idnp', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.birthDate')}</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.uploadSelfie')}</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange('selfie', e.target.files?.[0])}
                    />
                  </div>
                  <Button onClick={handleNext} className="w-full">
                    {t('common.next')}
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 text-center">
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">{t('auth.pendingApproval')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('auth.approvalMessage')}
                    </p>
                  </div>
                  <Button onClick={handleFinish} className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.finish')}
                  </Button>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                  <h3 className="font-semibold text-xl">{t('common.success')}</h3>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to dashboard...
                  </p>
                </div>
              )}

              {step < 4 && (
                <div className="text-center text-sm text-muted-foreground">
                  {t('auth.hasAccount')}{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    {t('nav.login')}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
