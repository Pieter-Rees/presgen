import { useState, useCallback, useEffect } from 'react';
import type { GiftFormData, GiftSuggestion, GiftData } from '@/types/gift';
import { API_CONFIG, SYSTEM_PROMPT, buildGiftPrompt } from '@/config/apiConfig';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

interface ChatCompletionPayload {
  messages: ChatMessage[];
  temperature: number;
  max_tokens: number;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface GiftSuggestionPayload {
  suggestions?: GiftSuggestion[];
}

async function requestGiftSuggestions(payload: ChatCompletionPayload): Promise<GiftSuggestion[]> {
  const response = await fetch('/api/generate-gifts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data: ChatCompletionResponse = await response.json();
  const aiResponse = data.choices?.[0]?.message?.content;

  if (!aiResponse) {
    throw new Error('No response from AI model');
  }

  let parsed: GiftSuggestionPayload;
  try {
    parsed = JSON.parse(aiResponse);
  } catch {
    throw new Error('Invalid response format from AI');
  }

  if (!Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
    throw new Error('No suggestions received from AI');
  }

  return parsed.suggestions;
}

function initializeGiftData(): GiftData | null {
  return getStorageItem<GiftData>('presgen-current-gift-data');
}

export function useGiftGeneration() {
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initialized = initializeGiftData();
    setGiftData(initialized);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!giftData) {
      removeStorageItem('presgen-current-gift-data');
      return;
    }

    setStorageItem('presgen-current-gift-data', giftData);
  }, [giftData, isHydrated]);

  const generateGifts = useCallback(async (formData: GiftFormData, savedGiftNames: string[] = []) => {
    setIsGenerating(true);
    setError(null);

    try {
      const suggestions = await requestGiftSuggestions({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildGiftPrompt(formData, savedGiftNames, false) }
        ],
        temperature: API_CONFIG.defaultTemperature,
        max_tokens: API_CONFIG.defaultMaxTokens,
      });

      setGiftData({
        recipient: formData,
        suggestions,
      });
    } catch (error) {
      console.error('Error generating gifts:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate gift suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const regenerateGifts = useCallback(async (savedGiftNames: string[] = []) => {
    if (!giftData) return;

    setIsGenerating(true);
    setError(null);

    try {
      const suggestions = await requestGiftSuggestions({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildGiftPrompt(giftData.recipient, savedGiftNames, true) }
        ],
        temperature: API_CONFIG.regenerateTemperature,
        max_tokens: API_CONFIG.defaultMaxTokens,
      });

      setGiftData(prev => (prev ? { ...prev, suggestions } : prev));
    } catch (error) {
      console.error('Error regenerating gifts:', error);
      setError(error instanceof Error ? error.message : 'Failed to regenerate gift suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [giftData]);

  const reset = useCallback(() => {
    setGiftData(null);
    setError(null);
    removeStorageItem('presgen-current-gift-data');
  }, []);

  return {
    giftData,
    isGenerating,
    error,
    generateGifts,
    regenerateGifts,
    reset,
    setError
  };
}

