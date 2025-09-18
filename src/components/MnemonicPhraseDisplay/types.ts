export interface MnemonicPhraseDisplayProps {
  mnemonic: string;
  onBack?: () => void;
  onContinue?: () => void;
  showBackButton?: boolean;
  showContinueButton?: boolean;
  isLoading?: boolean;
}
