export interface GiftFormData {
  name: string;
  relationship: string;
  age: string;
  interests: string[];
  budget: string;
  occasion: string;
  additionalInfo: string;
}

export interface GiftSuggestion {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  reason: string;
}

export interface SavedGift {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  reason: string;
  recipientName: string;
  savedAt: Date;
}

export interface GiftData {
  recipient: GiftFormData;
  suggestions: GiftSuggestion[];
}

export type ViewMode = 'generator' | 'saved' | 'detail';

