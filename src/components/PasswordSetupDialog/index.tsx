'use client'

/**
 * Dialog component for setting up PIN and storing encrypted key
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/FormWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/Form/Button';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/Form/InputOTP';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

const PIN_LENGTH = 6;

const pinSetupSchema = z.object({
  pin: z.string()
    .length(PIN_LENGTH, `PIN must be exactly ${PIN_LENGTH} digits`)
    .regex(/^\d+$/, 'PIN must contain only numbers'),
  confirmPin: z.string()
    .length(PIN_LENGTH, `PIN must be exactly ${PIN_LENGTH} digits`)
    .regex(/^\d+$/, 'PIN must contain only numbers'),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ['confirmPin'],
});

type PinSetupFormData = z.infer<typeof pinSetupSchema>;

interface PasswordSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  privateKeyHex: string;
  onComplete?: () => void;
  title?: string;
  description?: string;
}

export function PasswordSetupDialog({
  open,
  onOpenChange,
  userId,
  privateKeyHex,
  onComplete,
  title = 'Set Up PIN',
  description = 'Create a 6-digit PIN to encrypt and protect your private key. You will need this PIN to unlock your session for signing documents.',
}: PasswordSetupDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const { storeKey, unlock } = useSession();

  const form = useForm<PinSetupFormData>({
    resolver: zodResolver(pinSetupSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  const pin = form.watch('pin');
  const confirmPin = form.watch('confirmPin');

  // Auto-advance to confirm step when PIN is complete
  const handlePinComplete = (value: string) => {
    form.setValue('pin', value);
    if (value.length === PIN_LENGTH) {
      setStep('confirm');
    }
  };

  // Auto-submit when confirm PIN is complete
  const handleConfirmPinComplete = (value: string) => {
    form.setValue('confirmPin', value);
    if (value.length === PIN_LENGTH && pin.length === PIN_LENGTH) {
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: PinSetupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Store encrypted key with PIN
      await storeKey(privateKeyHex, data.pin, userId);
      
      // Automatically unlock session with the PIN
      await unlock(data.pin, userId);
      
      form.reset();
      setStep('enter');
      onComplete?.();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set up PIN';
      setError(errorMessage);
      form.setError('pin', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    form.setValue('confirmPin', '');
    setStep('enter');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 'enter' ? (
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-center text-lg">Enter your new PIN</FormLabel>
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
            ) : (
              <FormField
                control={form.control}
                name="confirmPin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-center text-lg">Confirm your PIN</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={PIN_LENGTH}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={field.value}
                        onChange={handleConfirmPinComplete}
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
            )}

            {error && (
              <div className="text-sm text-destructive text-center">{error}</div>
            )}

            <div className="flex justify-center gap-2">
              {step === 'confirm' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {step === 'confirm' && (
                <Button type="submit" disabled={isLoading || confirmPin.length !== PIN_LENGTH}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set PIN
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

