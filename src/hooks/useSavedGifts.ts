import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SavedGift, GiftSuggestion } from '@/types/gift';
import { getPriceLabel } from '@/utils/formatting';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';

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

function initializeSavedGifts(): SavedGift[] {
  const parsed = getStorageItem<StoredSavedGift[]>('presgen-saved-gifts');
  if (!parsed || !Array.isArray(parsed)) {
    if (parsed && !Array.isArray(parsed)) {
      removeStorageItem('presgen-saved-gifts');
    }
    return [];
  }

  return parsed.map(sanitizeSavedGift).filter(gift => {
    const originalId = extractOriginalId(gift.id);
    return originalId !== null && !isNaN(gift.savedAt.getTime());
  });
}

export function useSavedGifts() {
  const [savedGifts, setSavedGifts] = useState<SavedGift[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initialized = initializeSavedGifts();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedGifts(initialized);
    setIsHydrated(true);
  }, []);

  const savedGiftIds = useMemo(() => {
    const validIds = savedGifts.map(gift => extractOriginalId(gift.id)).filter((id): id is number => id !== null);
    return new Set(validIds);
  }, [savedGifts]);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (savedGifts.length === 0) {
      removeStorageItem('presgen-saved-gifts');
      return;
    }
    setStorageItem('presgen-saved-gifts', savedGifts);
  }, [savedGifts, isHydrated]);

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
  }, [savedGiftIds]);

  const removeGift = useCallback((id: string) => {
    const giftToRemove = savedGifts.find(gift => gift.id === id);
    if (!giftToRemove) {
      return;
    }

    setSavedGifts(prev => prev.filter(gift => gift.id !== id));
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

