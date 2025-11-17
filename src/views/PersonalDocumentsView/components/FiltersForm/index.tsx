'use client'

import { FC } from "react";
import { DocumentState } from "../DocumentsList/types";
import Checkbox from "@/components/Form/Checkbox";
import { Label } from "@/components/Form/Label";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/Form/Button";

interface FiltersFormProps {
  selectedStates: DocumentState[];
  onStateChange: (states: DocumentState[]) => void;
  onClear: () => void;
}

const FiltersForm: FC<FiltersFormProps> = ({ selectedStates, onStateChange, onClear }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const allStates = [
    DocumentState.Pending,
    DocumentState.Signed,
    DocumentState.Rejected,
    DocumentState.Expired,
  ];

  const getStateLabel = (state: DocumentState) => {
    switch (state) {
      case DocumentState.Pending:
        return t('documents.status.pending') || 'Pending';
      case DocumentState.Signed:
        return t('documents.status.signed') || 'Signed';
      case DocumentState.Rejected:
        return t('documents.status.rejected') || 'Rejected';
      case DocumentState.Expired:
        return t('documents.status.expired') || 'Expired';
    }
  };

  const handleStateToggle = (state: DocumentState) => {
    if (selectedStates.includes(state)) {
      onStateChange(selectedStates.filter(s => s !== state));
    } else {
      onStateChange([...selectedStates, state]);
    }
  };

  const hasFilters = selectedStates.length > 0;

  return (
    <div className="flex flex-col gap-4 min-w-[200px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t('documents.filter') || 'Filter'}</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            {t('documents.filter.clear') || 'Clear'}
          </Button>
        )}
      </div>
      
      <div className="flex flex-col gap-3">
        {allStates.map((state) => (
          <div key={state} className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${state}`}
              checked={selectedStates.includes(state)}
              onCheckedChange={() => handleStateToggle(state)}
            />
            <Label
              htmlFor={`filter-${state}`}
              className="text-sm font-normal cursor-pointer"
            >
              {getStateLabel(state)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FiltersForm;
