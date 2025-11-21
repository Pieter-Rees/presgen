import { useState, useEffect, useCallback } from 'react';
import type { SavedGift, GiftSuggestion } from '@/types/gift';

const STORAGE_KEY = 'presgen-saved-gifts';

export function useSavedGifts() {
  const [savedGifts, setSavedGifts] = useState<SavedGift[]>([]);
  const [savedGiftIds, setSavedGiftIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const gifts = parsed.map((gift: SavedGift) => ({
          ...gift,
          savedAt: new Date(gift.savedAt)
        }));
        setSavedGifts(gifts);
        setSavedGiftIds(new Set(gifts.map((gift: SavedGift) => parseInt(gift.id.split('-')[0]))));
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGifts));
  }, [savedGifts]);

  const saveGift = useCallback((gift: GiftSuggestion, recipientName: string) => {
    if (savedGiftIds.has(gift.id)) return;

    const savedGift: SavedGift = {
      id: `${gift.id}-${Date.now()}`,
      name: gift.name,
      description: gift.description,
      price: gift.price,
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
    if (giftToRemove) {
      const originalId = parseInt(giftToRemove.id.split('-')[0]);
      setSavedGifts(prev => prev.filter(gift => gift.id !== id));
      setSavedGiftIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(originalId);
        return newSet;
      });
    }
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

