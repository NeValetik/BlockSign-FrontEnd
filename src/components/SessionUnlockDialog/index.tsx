'use client'

/**
 * Dialog component for unlocking session with PIN or seed phrase
 * Automatically detects if PIN is set and shows appropriate UI
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/FormWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/Form/Button';
import { Loader2, Key, FileKey } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { hasEncryptedKey } from '@/lib/auth/indexedDB';
import { getPkFromMnemonic } from '@/utils/getPkFromMnemonic';
import { setSessionKeyDirect } from '@/lib/auth/sessionManager';
import MnemonicInput from '@/components/MnemonicInput';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/Form/InputOTP';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

const PIN_LENGTH = 6;

const unlockSchema = z.object({
  pin: z.string()
    .length(PIN_LENGTH, `PIN must be ${PIN_LENGTH} digits`)
    .regex(/^\d+$/, 'PIN must contain only numbers'),
});

const seedPhraseSchema = z.object({
  mnemonic: z.string()
    .min(1, 'Seed phrase is required')
    .refine((val) => {
      const words = val.trim().split(/\s+/).filter(w => w.length > 0);
      return words.length >= 12;
    }, 'Seed phrase must be at least 12 words'),
});

type UnlockFormData = z.infer<typeof unlockSchema>;
type SeedPhraseFormData = z.infer<typeof seedPhraseSchema>;

interface SessionUnlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onUnlocked?: () => void;
  title?: string;
  description?: string;
}

export function SessionUnlockDialog({
  open,
  onOpenChange,
  userId,
  onUnlocked,
  title,
  description,
}: SessionUnlockDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPinSet, setHasPinSet] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'pin' | 'seed'>('pin');
  const { unlock } = useSession();

  // Check if PIN is set when dialog opens
  useEffect(() => {
    const checkPinStatus = async () => {
      if (open && userId) {
        const hasKey = await hasEncryptedKey(userId);
        setHasPinSet(hasKey);
        setMode(hasKey ? 'pin' : 'seed');
      }
    };
    checkPinStatus();
  }, [open, userId]);

  const pinForm = useForm<UnlockFormData>({
    resolver: zodResolver(unlockSchema),
    defaultValues: {
      pin: '',
    },
  });

  const seedForm = useForm<SeedPhraseFormData>({
    resolver: zodResolver(seedPhraseSchema),
    defaultValues: {
      mnemonic: '',
    },
  });

  const pin = pinForm.watch('pin');

  // Auto-submit when PIN is complete
  const handlePinComplete = async (value: string) => {
    pinForm.setValue('pin', value);
    if (value.length === PIN_LENGTH) {
      // Trigger form submission
      pinForm.handleSubmit(onPinSubmit)();
    }
  };

  const onPinSubmit = async (data: UnlockFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await unlock(data.pin, userId);
      pinForm.reset();
      onUnlocked?.();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Incorrect PIN';
      setError(errorMessage);
      pinForm.setValue('pin', ''); // Clear PIN on error
    } finally {
      setIsLoading(false);
    }
  };

  const onSeedSubmit = async (data: SeedPhraseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const privateKeyHex = await getPkFromMnemonic(data.mnemonic);
      setSessionKeyDirect(privateKeyHex);
      seedForm.reset();
      onUnlocked?.();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid seed phrase';
      setError(errorMessage);
      seedForm.setError('mnemonic', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic title and description based on mode
  const displayTitle = title || (mode === 'pin' ? 'Enter PIN' : 'Enter Seed Phrase');
  const displayDescription = description || (mode === 'pin' 
    ? 'Enter your 6-digit PIN to unlock your session and sign documents.'
    : 'Your PIN is not set up. Enter your seed phrase to proceed. You can set up a PIN in Account Settings > Protection for easier access.');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{displayTitle}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>

        {hasPinSet === null ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : mode === 'pin' ? (
          <Form {...pinForm}>
            <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-6">
              <FormField
                control={pinForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={PIN_LENGTH}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={field.value}
                        onChange={handlePinComplete}
                        disabled={isLoading}
                        autoFocus
                      >
                        <InputOTPGroup>
                          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                            <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive text-center">{error}</div>
              )}

              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              <div className="flex flex-col items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMode('seed');
                    setError(null);
                    pinForm.reset();
                  }}
                  disabled={isLoading}
                  className="text-muted-foreground"
                >
                  <FileKey className="h-4 w-4 mr-1" />
                  Use seed phrase instead
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...seedForm}>
            <form onSubmit={seedForm.handleSubmit(onSeedSubmit)} className="space-y-4">
              <FormField
                control={seedForm.control}
                name="mnemonic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seed Phrase</FormLabel>
                    <FormControl>
                      <MnemonicInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        wordCount={12}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}

              <div className="flex justify-between items-center gap-2">
                {hasPinSet && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMode('pin');
                      setError(null);
                      seedForm.reset();
                    }}
                    disabled={isLoading}
                    className="text-muted-foreground"
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Use PIN instead
                  </Button>
                )}
                {!hasPinSet && <div />}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Unlock
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

