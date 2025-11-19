'use client'

import { FC, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/Dialog";
import Button from "@/components/Form/Button";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/utils/cn";

interface RejectSignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason?: string) => void;
  isRejecting?: boolean;
}

const RejectSignModal: FC<RejectSignModalProps> = ({
  open,
  onOpenChange,
  onReject,
  isRejecting = false,
}) => {
  const [reason, setReason] = useState("");
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const handleSubmit = () => {
    onReject(reason.trim() || undefined);
    setReason("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('documents.reject.confirmTitle') || 'Are you sure you want to reject this document?'}</DialogTitle>
          <DialogDescription>
            {t('documents.reject.confirmDescription') || 'This action cannot be undone. Please provide a reason for rejection (optional).'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="reject-reason" className="text-sm font-medium">
              {t('documents.reject.reasonLabel') || 'Reason for rejection (optional)'}
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('documents.reject.reasonPlaceholder') || 'Enter your reason here...'}
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-brand selection:text-brand-foreground dark:bg-input/30 border-input flex min-h-[100px] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
              )}
              disabled={isRejecting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isRejecting}
          >
            {t('documents.reject.cancel') || 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isRejecting}
          >
            {isRejecting 
              ? (t('documents.reject.rejecting') || 'Rejecting...') 
              : (t('documents.actions.reject') || 'Reject')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectSignModal;
