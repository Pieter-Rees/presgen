import type { SavedGift } from '@/types/gift';

export function getSavedGiftNames(gifts: SavedGift[]): string[] {
  return gifts.map(gift => gift.name);
}

