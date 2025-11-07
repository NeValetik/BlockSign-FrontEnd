import { FC } from "react";
import { DocumentState } from "../../types";
import { cn } from "@/utils/cn";

interface DocumentStateTagProps {
  state: DocumentState;
}

const DocumentStateTag: FC<DocumentStateTagProps> = ({ state }) => {
  const getStateColor = (state: DocumentState) => {
    switch (state) {
      case DocumentState.Pending:
        return 'bg-yellow-500';
      case DocumentState.Signed:
        return 'bg-brand';
      case DocumentState.Rejected:
        return 'bg-destructive';
      case DocumentState.Expired:
        return 'bg-gray-500';
    }
  }
  return (
    <div 
      className={cn(getStateColor(state),
        "rounded-md px-2 py-1 text-sm text-brand-foreground"
      )}
    >
      <span>{state.toLocaleLowerCase()}</span>
    </div>
  )
}

export default DocumentStateTag;