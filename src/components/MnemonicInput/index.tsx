"use client"

import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/utils/cn";

interface MnemonicInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  wordCount?: number;
}

const MnemonicInput = ({
  value,
  onChange,
  onBlur,
  className,
  wordCount = 12,
}: MnemonicInputProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isInternalUpdate = useRef(false);

  // Sync with external value prop
  useEffect(() => {
    // Skip if this update was triggered internally
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      setWords([]);
      setCurrentIndex(0);
      return;
    }

    const parsedWords = trimmed.split(/\s+/).filter((w) => w.length > 0);
    if (parsedWords.length <= wordCount) {
      setWords(parsedWords);
      setCurrentIndex(Math.min(parsedWords.length, wordCount - 1));
    } else {
      setWords(parsedWords.slice(0, wordCount));
      setCurrentIndex(wordCount - 1);
    }
  }, [value, wordCount]);

  // Focus the current input when it changes
  useEffect(() => {
    const currentInput = inputRefs.current[currentIndex];
    if (currentInput) {
      setTimeout(() => currentInput.focus(), 0);
    }
  }, [currentIndex]);

  const updateValue = (newWords: string[]) => {
    isInternalUpdate.current = true;
    onChange(newWords.join(" "));
  };

  const handleInputChange = (index: number, newValue: string) => {
    // Remove spaces from input
    const cleanValue = newValue.replace(/\s+/g, "");
    
    const newWords = [...words];
    
    // Ensure array is long enough
    while (newWords.length <= index) {
      newWords.push("");
    }
    
    newWords[index] = cleanValue;
    
    // Remove trailing empty words
    while (newWords.length > 0 && newWords[newWords.length - 1] === "") {
      newWords.pop();
    }
    
    setWords(newWords);
    updateValue(newWords);
  };

  const handleInputPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const parsedWords = pastedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .slice(0, wordCount);
    
    setWords(parsedWords);
    setCurrentIndex(Math.min(parsedWords.length, wordCount - 1));
    updateValue(parsedWords);
  };

  const handleInputKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    // Allow paste
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      return;
    }

    // Handle space or enter to move to next input
    if ((e.key === " " || e.key === "Enter") && words[index]?.trim().length > 0) {
      e.preventDefault();
      if (index < wordCount - 1) {
        const nextIndex = index + 1;
        setCurrentIndex(nextIndex);
        // Ensure next input exists
        if (!words[nextIndex]) {
          const newWords = [...words];
          while (newWords.length <= nextIndex) {
            newWords.push("");
          }
          setWords(newWords);
        }
      }
      return;
    }

    // Handle backspace on empty input - go to previous input
    if (e.key === "Backspace" && words[index] === "" && index > 0) {
      e.preventDefault();
      const newWords = words.slice(0, index);
      setWords(newWords);
      updateValue(newWords);
      setCurrentIndex(index - 1);
      return;
    }

    // Handle arrow keys
    if (e.key === "ArrowRight" && index < wordCount - 1) {
      e.preventDefault();
      const nextIndex = index + 1;
      setCurrentIndex(nextIndex);
      // Ensure next input exists
      if (!words[nextIndex]) {
        const newWords = [...words];
        while (newWords.length <= nextIndex) {
          newWords.push("");
        }
        setWords(newWords);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      setCurrentIndex(index - 1);
    }
  };

  const handleInputFocus = (index: number) => {
    setCurrentIndex(index);
    // Ensure input exists in array
    if (!words[index]) {
      const newWords = [...words];
      while (newWords.length <= index) {
        newWords.push("");
      }
      setWords(newWords);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsedWords = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .slice(0, wordCount);
      
      setWords(parsedWords);
      setCurrentIndex(Math.min(parsedWords.length, wordCount - 1));
      updateValue(parsedWords);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleClearAll = () => {
    setWords([]);
    setCurrentIndex(0);
    updateValue([]);
    // Focus first input
    setTimeout(() => {
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    }, 0);
  };

  // Determine how many inputs to show (only show when there are words or user has interacted)
  const inputsToShow = words.length === 0 && currentIndex === 0 
    ? 0 
    : Math.min(wordCount, Math.max(words.length, currentIndex + 1));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main input block - contains input cells */}
      <div className={cn(
        "rounded-lg border border-input bg-input/30 dark:bg-input/30 h-[310px]",
        "p-4 space-y-4"
      )}>
        {/* Show placeholder textarea only when no words entered */}
        {words.length === 0 && currentIndex === 0 && (
          <button 
            className="
              h-full w-full cursor-text text-muted-foreground 
              justify-start items-start flex text-start gap-2
            " 
            type="button" 
            onClick={()=>{
              setWords([""]);
              setCurrentIndex(0);
              updateValue([""]);
              // Focus first input after state updates
              setTimeout(() => {
                const firstInput = inputRefs.current[0];
                if (firstInput) {
                  firstInput.focus();
                }
              }, 0);
            }}
          >
            Add a space between each word and make sure no one is watching
          </button>
        )}

        {/* Individual input fields - shown when user starts typing */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: inputsToShow }).map((_, index) => {
            const wordValue = words[index] || "";
            const isActive = index === currentIndex;
            
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm font-medium w-6 text-right shrink-0">
                  {index + 1}.
                </span>
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={wordValue}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleInputKeyDown(index, e)}
                  onPaste={handleInputPaste}
                  onFocus={() => handleInputFocus(index)}
                  onBlur={onBlur}
                  placeholder={index === 0 && words.length === 0 ? "Word 1..." : "..."}
                  autoComplete="off"
                  spellCheck="false"
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-brand selection:text-brand-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "flex-1"
                  )}
                />
              </div>
            );
          })}
        </div>
        
      </div>
      {/* Clear all button */}
      {words.length > 0 && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm text-brand hover:text-brand-muted underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
      {
        words.length === 0 && currentIndex === 0 && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handlePaste}
              className="text-sm text-brand hover:text-brand-muted underline cursor-pointer"
            >
              Paste
            </button>
          </div>
        )
      }
    </div>
  );
};

export default MnemonicInput;
