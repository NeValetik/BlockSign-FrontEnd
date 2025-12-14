'use client'

/**
 * Dialog component for unlocking session with password
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/FormWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/Form/Button';
import { InputPassword } from '@/components/Form/Input';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

const unlockSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type UnlockFormData = z.infer<typeof unlockSchema>;

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
  title = 'Unlock Session',
  description = 'Enter your password to unlock your session and sign documents.',
}: SessionUnlockDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { unlock } = useSession();

  const form = useForm<UnlockFormData>({
    resolver: zodResolver(unlockSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data: UnlockFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await unlock(data.password, userId);
      form.reset();
      onUnlocked?.();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlock session';
      setError(errorMessage);
      form.setError('password', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      autoFocus
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
                Unlock
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

