import { useState, useEffect, useCallback } from 'react';
import type { GiftFormData, SavedRecipient } from '@/types/gift';

const STORAGE_KEY = 'presgen-saved-recipients';

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

export function useSavedRecipients() {
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as StoredRecipient[];
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid saved recipients format');
      }

      const recipients = parsed
        .map(sanitizeRecipient)
        .filter(recipient => !isNaN(recipient.savedAt.getTime()));

      setSavedRecipients(recipients);
    } catch (error) {
      console.error('Failed to parse saved recipients from storage', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (savedRecipients.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipients));
  }, [savedRecipients]);

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

  const getRecipientById = useCallback(
    (id: string) => savedRecipients.find(recipient => recipient.id === id),
    [savedRecipients]
  );

  return {
    savedRecipients,
    saveRecipientProfile,
    removeRecipient,
    getRecipientById,
  };
}

