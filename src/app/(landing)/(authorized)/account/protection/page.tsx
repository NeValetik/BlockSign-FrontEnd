"use client"

import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/Form/Button';
import { useUserContext } from '@/contexts/userContext';
import { hasEncryptedKey, deleteEncryptedKey } from '@/lib/auth/indexedDB';
import { PasswordSetupDialog } from '@/components/PasswordSetupDialog';
import { SeedPhraseUnlockDialog } from '@/components/SeedPhraseUnlockDialog';
import { getPrivateKeyHex, lockSession, sessionActive } from '@/lib/auth/sessionManager';
import { toast } from 'sonner';
import { Shield, Key, AlertTriangle, CheckCircle } from 'lucide-react';

// Note: Metadata cannot be exported from client components
// Metadata is handled by the parent layout

const ProfileSettingsPage: FC = () => {
  const { me } = useUserContext();
  const [hasPinSet, setHasPinSet] = useState<boolean | null>(null);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [showSeedPhraseDialog, setShowSeedPhraseDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'setup' | 'reset' | null>(null);
  const [privateKeyHex, setPrivateKeyHex] = useState<string | null>(null);

  // Check if PIN is set on mount
  useEffect(() => {
    const checkPinStatus = async () => {
      if (me?.id) {
        const hasKey = await hasEncryptedKey(me.id);
        setHasPinSet(hasKey);
      }
    };
    checkPinStatus();
  }, [me?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const fieldVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const handleSetupPin = () => {
    // Check if session is active (has private key in memory)
    if (sessionActive()) {
      const pkHex = getPrivateKeyHex();
      if (pkHex) {
        setPrivateKeyHex(pkHex);
        setShowPasswordSetup(true);
        return;
      }
    }
    // If session is not active, we need the seed phrase
    setPendingAction('setup');
    setShowSeedPhraseDialog(true);
  };

  const handleResetPin = async () => {
    if (!me?.id) return;
    
    // Delete existing encrypted key
    try {
      await deleteEncryptedKey(me.id);
      lockSession();
      setHasPinSet(false);
      toast.success('PIN has been reset. Please set up a new 6-digit PIN.');
      
      // Prompt to set up new PIN
      setPendingAction('setup');
      setShowSeedPhraseDialog(true);
    } catch (error) {
      toast.error('Failed to reset PIN');
    }
  };

  const handleSeedPhraseUnlocked = () => {
    // After seed phrase is entered, get the private key and show password setup
    const pkHex = getPrivateKeyHex();
    if (pkHex && pendingAction === 'setup') {
      setPrivateKeyHex(pkHex);
      setShowPasswordSetup(true);
    }
    setPendingAction(null);
    setShowSeedPhraseDialog(false);
  };

  const handlePasswordSetupComplete = () => {
    setShowPasswordSetup(false);
    setPrivateKeyHex(null);
    setHasPinSet(true);
    toast.success('6-digit PIN has been set up successfully!');
  };

  return (
    <motion.div 
      className="p-6 border rounded-md flex flex-col gap-6 bg-muted/50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fieldVariants}>
        <h2 className="text-3xl font-semibold text-foreground mb-6">Protection</h2>
        
        {/* PIN Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium text-foreground">6-Digit PIN</h3>
          </div>
          
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <div className="flex items-start gap-3">
              {hasPinSet === null ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : hasPinSet ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">PIN is set up</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your private key is encrypted and stored securely. You can unlock your session with your 6-digit PIN instead of entering your seed phrase each time.
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleResetPin}
                    >
                      Reset PIN
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">PIN not set up</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Without a PIN, you&apos;ll need to enter your seed phrase every time you need to sign a document. Set up a 6-digit PIN for easier access.
                    </p>
                    <Button 
                      variant="brand"
                      size="sm"
                      className="mt-3"
                      onClick={handleSetupPin}
                    >
                      Set Up PIN
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Password Section */}
      <motion.div variants={fieldVariants}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium text-foreground">Account Password</h3>
          </div>
          <div>
            <Button 
              variant="brand"
              size="default"
            >
              Change password
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Multi-factor Section */}
      <motion.div 
        className="flex flex-col gap-4"
        variants={fieldVariants}
      >
        <h3 className="text-base font-medium text-foreground">Multi-factor Authentication</h3>
        <motion.div 
          className="flex flex-row gap-2"
          variants={containerVariants}
        >
          <motion.div variants={fieldVariants}>
            <Button 
              variant="brand"
              size="default"
            >
              Confirm phone
            </Button>
          </motion.div>
          <motion.div variants={fieldVariants}>
            <Button 
              variant="brand"
              size="default"
            >
              Enable authenticator
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Seed Phrase Dialog for getting private key */}
      <SeedPhraseUnlockDialog
        open={showSeedPhraseDialog}
        onOpenChange={setShowSeedPhraseDialog}
        onUnlocked={handleSeedPhraseUnlocked}
        title="Enter Seed Phrase"
        description="Enter your seed phrase to set up your 6-digit PIN. This will encrypt your private key for easier access."
      />

      {/* PIN Setup Dialog */}
      {me?.id && privateKeyHex && (
        <PasswordSetupDialog
          open={showPasswordSetup}
          onOpenChange={setShowPasswordSetup}
          userId={me.id}
          privateKeyHex={privateKeyHex}
          onComplete={handlePasswordSetupComplete}
          title="Set Up PIN"
          description="Create a 6-digit PIN to encrypt and protect your private key. You will need this PIN to unlock your session for signing documents."
        />
      )}
    </motion.div>
  );
};

export default ProfileSettingsPage;
