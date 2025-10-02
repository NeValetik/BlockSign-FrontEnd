"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Form/Input";
import Button from "@/components/Form/Button";
import { setCookie } from "@/utils/cookie";
import { getPkFromMnemonic } from "@/utils/getPkFromMnemonic";
import { toast } from "sonner";
import { z } from "zod";

const mnemonicSchema = z.object({
  mnemonic: z.string().min(1, "Mnemonic phrase is required").min(12, "Mnemonic phrase must be at least 12 words"),
});

type MnemonicFormData = z.infer<typeof mnemonicSchema>;

interface MnemonicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPrivateKeyGenerated: (privateKey: string) => void;
}

const MnemonicDialog = ({ isOpen, onClose, onPrivateKeyGenerated }: MnemonicDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<MnemonicFormData>({
    resolver: zodResolver(mnemonicSchema),
    defaultValues: {
      mnemonic: "",
    }
  });

  const onSubmit = async (data: MnemonicFormData) => {
    setIsLoading(true);
    try {
      // Generate private key from mnemonic
      const privateKey = await getPkFromMnemonic(data.mnemonic);
      
      // Store private key in cookie (secure, httpOnly would be better but this is client-side)
      setCookie('privateKey', privateKey, {
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
      });
      
      // Call the callback with the private key
      onPrivateKeyGenerated(privateKey);
      
      toast.success("Private key generated successfully!");
      onClose();
    } catch (error) {
      console.error('Failed to generate private key:', error);
      toast.error("Invalid mnemonic phrase. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Mnemonic Phrase</DialogTitle>
          <DialogDescription>
            Your mnemonic phrase is required to sign documents. This will be used to generate your private key securely.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mnemonic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mnemonic Phrase</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your 12-word mnemonic phrase"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Private Key"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MnemonicDialog;
