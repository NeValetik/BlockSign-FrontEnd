'use client'

/**
 * Dialog component for unlocking session with seed phrase
 * Used when PIN password is not set up
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/FormWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/Form/Button';
import { Loader2 } from 'lucide-react';
import { getPkFromMnemonic } from '@/utils/getPkFromMnemonic';
import { setSessionKeyDirect } from '@/lib/auth/sessionManager';
import MnemonicInput from '@/components/MnemonicInput';

const seedPhraseSchema = z.object({
  mnemonic: z.string()
    .min(1, 'Seed phrase is required')
    .refine((val) => {
      const words = val.trim().split(/\s+/).filter(w => w.length > 0);
      return words.length >= 12;
    }, 'Seed phrase must be at least 12 words'),
});

type SeedPhraseFormData = z.infer<typeof seedPhraseSchema>;

interface SeedPhraseUnlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked?: () => void;
  title?: string;
  description?: string;
}

export function SeedPhraseUnlockDialog({
  open,
  onOpenChange,
  onUnlocked,
  title = 'Enter Seed Phrase',
  description = 'Your 6-digit PIN is not set up. Enter your seed phrase to proceed with this action. You can set up a PIN in Account Settings > Protection for easier access.',
}: SeedPhraseUnlockDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SeedPhraseFormData>({
    resolver: zodResolver(seedPhraseSchema),
    defaultValues: {
      mnemonic: '',
    },
  });

  const onSubmit = async (data: SeedPhraseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Derive private key from mnemonic
      const privateKeyHex = await getPkFromMnemonic(data.mnemonic);
      
      // Set session key directly (without storing encrypted key)
      setSessionKeyDirect(privateKeyHex);
      
      form.reset();
      onUnlocked?.();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid seed phrase';
      setError(errorMessage);
      form.setError('mnemonic', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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

            <div className="flex justify-end gap-2">
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
                Unlock Session
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
