"use client"

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Button from "@/components/Form/Button";
import { MnemonicPhraseDisplayProps } from "./types";


const MnemonicPhraseDisplay = ({ 
  mnemonic, 
  onContinue,
  showContinueButton = true
}: MnemonicPhraseDisplayProps) => {
  const [copied, setCopied] = useState(false);
  
  const words = mnemonic.trim().split(' ').filter(word => word.length > 0);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy text');
    }
  };

  return (
    <div className="text-foreground flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-6">
        <div className="w-full max-w-sm sm:max-w-md mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 rounded-r-lg">
            <h2 className="text-destructive font-semibold text-base sm:text-2xl mb-2">Attention</h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Never share the mnemonic phrase. Anyone with these words has full access to your account
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mb-6 sm:mb-8">
          <div className="bg-background rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-separate">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {words.map((word, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-muted-foreground text-xs sm:text-sm font-medium w-4 sm:w-6 text-right">
                    {index + 1}
                  </span>
                  <span className="text-foreground font-medium text-sm sm:text-base">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
                <span className="text-brand font-medium text-sm sm:text-base">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-muted-foreground group-hover:text-foreground font-medium text-sm sm:text-base transition-colors">
                  Copy to clipboard
                </span>
              </>
            )}
          </Button>

          {showContinueButton && (
            <Button
              onClick={onContinue}
              variant="brand"
              className="w-full"
            >
              I&lsquo;ve saved my phrase
            </Button>
          )}
        </div>

        <div className="w-full max-w-sm sm:max-w-md mt-6 sm:mt-8">
          <p className="text-muted-foreground text-xs sm:text-sm text-center leading-relaxed">
            Store this mnemonic phrase in a safe place. You&lsquo;ll need it to access your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MnemonicPhraseDisplay;
