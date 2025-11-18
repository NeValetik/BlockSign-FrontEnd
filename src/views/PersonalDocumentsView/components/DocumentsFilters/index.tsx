'use client'

import { FC, useState } from "react";
import { DocumentState } from "../DocumentsList/types";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Form/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Form/Popover";
import FiltersForm from "../FiltersForm";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import { Filter } from "lucide-react";

interface DocumentsFiltersProps {
  selectedStates: DocumentState[];
  onStateChange: (states: DocumentState[]) => void;
}

const DocumentsFilters: FC<DocumentsFiltersProps> = ({ selectedStates, onStateChange }) => {
  const [ open, setOpen ] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const handleClear = () => {
    onStateChange([]);
  };

  const hasActiveFilters = selectedStates.length > 0;

  return (
    <div className="flex gap-4">
      <SearchBar href="/account/documents" placeholder={t('documents.search') || 'Search documents'} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={hasActiveFilters ? "brand" : "outline"}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('documents.filter') || 'Filters'}
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-brand text-brand-foreground rounded-full">
                {selectedStates.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto">
          <FiltersForm
            selectedStates={selectedStates}
            onStateChange={onStateChange}
            onClear={handleClear}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DocumentsFilters;