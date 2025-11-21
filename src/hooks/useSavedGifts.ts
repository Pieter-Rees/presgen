import { useState, useEffect, useCallback } from 'react';
import type { SavedGift, GiftSuggestion } from '@/types/gift';
import { getPriceLabel } from '@/utils/formatting';

const STORAGE_KEY = 'presgen-saved-gifts';

interface StoredSavedGift extends Omit<SavedGift, 'savedAt'> {
  savedAt: string;
}

const sanitizeSavedGift = (gift: StoredSavedGift): SavedGift => ({
  ...gift,
  price: gift.price?.trim() ? gift.price : 'Range unavailable',
  savedAt: new Date(gift.savedAt),
});

const extractOriginalId = (id: string): number | null => {
  const parts = id.split('-');
  if (parts.length === 0) return null;
  const num = parseInt(parts[0], 10);
  return isNaN(num) ? null : num;
};

export function useSavedGifts() {
  const [savedGifts, setSavedGifts] = useState<SavedGift[]>([]);
  const [savedGiftIds, setSavedGiftIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as StoredSavedGift[];
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid saved gifts format');
      }

      const gifts = parsed.map(sanitizeSavedGift).filter(gift => {
        const originalId = extractOriginalId(gift.id);
        return originalId !== null && !isNaN(gift.savedAt.getTime());
      });
      
      setSavedGifts(gifts);
      const validIds = gifts.map(gift => extractOriginalId(gift.id)).filter((id): id is number => id !== null);
      setSavedGiftIds(new Set(validIds));
    } catch (error) {
      console.error('Failed to parse saved gifts from storage', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (savedGifts.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      setSavedGiftIds(new Set());
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGifts));
    const validIds = savedGifts.map(gift => extractOriginalId(gift.id)).filter((id): id is number => id !== null);
    setSavedGiftIds(new Set(validIds));
  }, [savedGifts]);

  const saveGift = useCallback((gift: GiftSuggestion, recipientName: string, recipientBudget?: string) => {
    if (savedGiftIds.has(gift.id)) {
      return;
    }

    const priceLabel = getPriceLabel(gift.price, recipientBudget);

    const savedGift: SavedGift = {
      id: `${gift.id}-${Date.now()}`,
      name: gift.name,
      description: gift.description,
      price: priceLabel,
      category: gift.category,
      reason: gift.reason,
      recipientName,
      savedAt: new Date()
    };

    setSavedGifts(prev => [...prev, savedGift]);
    setSavedGiftIds(prev => new Set([...prev, gift.id]));
  }, [savedGiftIds]);

  const removeGift = useCallback((id: string) => {
    const giftToRemove = savedGifts.find(gift => gift.id === id);
    if (!giftToRemove) {
      return;
    }

    const originalId = extractOriginalId(giftToRemove.id);

    setSavedGifts(prev => prev.filter(gift => gift.id !== id));
    setSavedGiftIds(prev => {
      if (originalId === null) return prev;
      const newSet = new Set(prev);
      newSet.delete(originalId);
      return newSet;
    });
  }, [savedGifts]);

  const getSavedGiftsForRecipient = useCallback((recipientName: string) => {
    return savedGifts.filter(gift => gift.recipientName === recipientName);
  }, [savedGifts]);

  return {
    savedGifts,
    savedGiftIds,
    saveGift,
    removeGift,
    getSavedGiftsForRecipient
  };
}

