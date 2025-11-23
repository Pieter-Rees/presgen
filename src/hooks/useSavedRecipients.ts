import { useState, useEffect, useCallback } from 'react';
import type { GiftFormData, SavedRecipient } from '@/types/gift';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';

interface StoredRecipient extends Omit<SavedRecipient, 'savedAt'> {
  savedAt: string;
}

const sanitizeRecipient = (recipient: StoredRecipient): SavedRecipient => ({
  ...recipient,
  savedAt: new Date(recipient.savedAt),
});

const getRecipientSignature = (recipient: GiftFormData) => {
  return [
    recipient.name.trim().toLowerCase(),
    recipient.relationship,
    recipient.age,
    recipient.occasion,
    recipient.budget,
    recipient.interests.join('|'),
  ].join('::');
};

function initializeSavedRecipients(): SavedRecipient[] {
  const parsed = getStorageItem<StoredRecipient[]>('presgen-saved-recipients');
  if (!parsed) {
    return [];
  }

  if (!Array.isArray(parsed)) {
    removeStorageItem('presgen-saved-recipients');
    return [];
  }

  return parsed
    .map(sanitizeRecipient)
    .filter(recipient => !isNaN(recipient.savedAt.getTime()));
}

export function useSavedRecipients() {
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initialized = initializeSavedRecipients();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedRecipients(initialized);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (savedRecipients.length === 0) {
      removeStorageItem('presgen-saved-recipients');
      return;
    }

    setStorageItem('presgen-saved-recipients', savedRecipients);
  }, [savedRecipients, isHydrated]);

  const saveRecipientProfile = useCallback((recipient: GiftFormData) => {
    const signature = getRecipientSignature(recipient);

    setSavedRecipients(prev => {
      const existing = prev.find(item => getRecipientSignature(item) === signature);
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...existing, ...recipient, savedAt: new Date() }
            : item
        );
      }

      const newRecipient: SavedRecipient = {
        id: `${recipient.name.trim() || 'recipient'}-${Date.now()}`,
        ...recipient,
        savedAt: new Date(),
      };

      return [...prev, newRecipient];
    });
  }, []);

  const removeRecipient = useCallback((id: string) => {
    setSavedRecipients(prev => prev.filter(recipient => recipient.id !== id));
  }, []);

  return {
    savedRecipients,
    saveRecipientProfile,
    removeRecipient,
  };
}

