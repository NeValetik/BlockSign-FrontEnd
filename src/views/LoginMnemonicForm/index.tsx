"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Form/Card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { schema } from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import { ILoginMnemonicForm } from "./types";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { getPkFromMnemonic } from "@/utils/getPkFromMnemonic";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import { useUserContext } from "@/contexts/userContext";
import { hasEncryptedKey } from "@/lib/auth/indexedDB";
import { PasswordSetupDialog } from "@/components/PasswordSetupDialog";
import { SessionUnlockDialog } from "@/components/SessionUnlockDialog";

import Button from "@/components/Form/Button";
import MnemonicInput from "@/components/MnemonicInput";

const DefaultValues: ILoginMnemonicForm = {
  mnemonic: "",
}

const LoginMnemonicForm = () => {
  const form = useForm<ILoginMnemonicForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [needsKeyCheck, setNeedsKeyCheck] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [privateKeyHex, setPrivateKeyHex] = useState<string | null>(null);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  const { me } = useUserContext();
  
  // Handle redirect after user data is loaded and key is created/unlocked
  useEffect(() => {
    if (shouldRedirect && me) {
      if (me.role === 'ADMIN') {
        push('/adminconsole');
      } else {
        push('/account/documents');
      }
      setShouldRedirect(false);
    }
  }, [shouldRedirect, me, push]);

  useEffect(() => {
    const checkAndShowDialogs = async () => {
      if (needsKeyCheck && me?.id && privateKeyHex) {
        const hasKey = await hasEncryptedKey(me.id);
        if (!hasKey) {
          setShowPasswordSetup(true);
          setNeedsKeyCheck(false); // Reset flag, wait for password setup to complete
        } else {
          setShowUnlockDialog(true);
          setNeedsKeyCheck(false); // Reset flag, wait for unlock to complete
        }
      }
    };
    checkAndShowDialogs();
  }, [needsKeyCheck, me, privateKeyHex]);
  
  // If no email parameter, redirect to login
  if (!email) {
    push("/login");
    return null;
  }
  
  const { handleSubmit, setError } = form;

  const onSubmit = async (data: ILoginMnemonicForm) => {
    setIsLoading(true);
    try {
      // Use NextAuth signIn with mnemonic provider
      const result = await signIn('mnemonic', {
        email: email,
        mnemonic: data.mnemonic,
        redirect: false,
      });

      if (result?.error) {
        setError('mnemonic', { message: t('auth.mnemonic.failed') });
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Derive private key from mnemonic
        const privateKey = await getPkFromMnemonic(data.mnemonic);
        setPrivateKeyHex(privateKey);

        // Refresh to get updated session and user data
        refresh();
        
        // Set flag to check for encrypted key after user data loads
        setNeedsKeyCheck(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('mnemonic', { message: t('auth.mnemonic.failedGeneric') });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle password setup completion
  const handlePasswordSetupComplete = () => {
    setShowPasswordSetup(false);
    setPrivateKeyHex(null);
    setShouldRedirect(true);
  }

  // Handle session unlock completion
  const handleUnlockComplete = () => {
    setShowUnlockDialog(false);
    setPrivateKeyHex(null);
    setShouldRedirect(true);
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>{t('auth.mnemonic.title')}</CardTitle>
            <CardDescription>
              {t('auth.mnemonic.label')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormField 
                    name="mnemonic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.mnemonic.label')}</FormLabel>
                        <FormControl>
                          <MnemonicInput
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} variant="brand">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('auth.mnemonic.authenticating') : t('auth.mnemonic.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Setup Dialog */}
      {me?.id && privateKeyHex && (
        <PasswordSetupDialog
          open={showPasswordSetup}
          onOpenChange={setShowPasswordSetup}
          userId={me.id}
          privateKeyHex={privateKeyHex}
          onComplete={handlePasswordSetupComplete}
        />
      )}

      {/* Session Unlock Dialog */}
      {me?.id && (
        <SessionUnlockDialog
          open={showUnlockDialog}
          onOpenChange={setShowUnlockDialog}
          userId={me.id}
          onUnlocked={handleUnlockComplete}
        />
      )}
    </main>
  )
}

export default LoginMnemonicForm;