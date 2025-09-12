'use client'

import { FC } from "react";

import SearchBar from "@/components/SearchBar";
import Button from "@/components/Form/Button";

const DocumentsFilters: FC = () => {

  return (
    <div
      className="flex gap-4"
    >
      <SearchBar href="/account/documents" />
      <Button
        variant="default"
      >
        Filters
      </Button>
    </div>
  );
};

export default DocumentsFilters;