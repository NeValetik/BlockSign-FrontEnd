import { FC } from "react";
import { DocumentState } from "../../types";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

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

  const tagVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: -10,
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={state}
        className={cn(getStateColor(state),
          "rounded-md px-2 py-1 text-sm text-brand-foreground"
        )}
        variants={tagVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <span>{state.toLocaleLowerCase()}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export default DocumentStateTag;