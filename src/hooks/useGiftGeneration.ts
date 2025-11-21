import { useState, useCallback, useEffect } from 'react';
import type { GiftFormData, GiftSuggestion, GiftData } from '@/types/gift';
import { API_CONFIG, SYSTEM_PROMPT, buildGiftPrompt } from '@/config/apiConfig';

const GIFT_DATA_STORAGE_KEY = 'presgen-current-gift-data';

export function useGiftGeneration() {
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(GIFT_DATA_STORAGE_KEY);
      if (!storedData) return;
      const parsedData: GiftData = JSON.parse(storedData);
      setGiftData(parsedData);
    } catch {
      localStorage.removeItem(GIFT_DATA_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!giftData) {
      localStorage.removeItem(GIFT_DATA_STORAGE_KEY);
      return;
    }

    localStorage.setItem(GIFT_DATA_STORAGE_KEY, JSON.stringify(giftData));
  }, [giftData]);

  const generateGifts = useCallback(async (
    formData: GiftFormData,
    savedGiftNames: string[] = []
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: buildGiftPrompt(formData, savedGiftNames, false)
            }
          ],
          temperature: API_CONFIG.defaultTemperature,
          max_tokens: API_CONFIG.defaultMaxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI model');
      }

      let suggestions: { suggestions: GiftSuggestion[] };
      try {
        suggestions = JSON.parse(aiResponse);
      } catch {
        throw new Error('Invalid response format from AI');
      }

      if (suggestions.suggestions && suggestions.suggestions.length > 0) {
        setGiftData({
          recipient: formData,
          suggestions: suggestions.suggestions
        });
      } else {
        throw new Error('No suggestions received from AI');
      }

    } catch (error) {
      console.error('Error generating gifts:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate gift suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const regenerateGifts = useCallback(async (
    savedGiftNames: string[] = []
  ) => {
    if (!giftData) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: buildGiftPrompt(giftData.recipient, savedGiftNames, true)
            }
          ],
          temperature: API_CONFIG.regenerateTemperature,
          max_tokens: API_CONFIG.defaultMaxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI model');
      }

      let suggestions: { suggestions: GiftSuggestion[] };
      try {
        suggestions = JSON.parse(aiResponse);
      } catch {
        throw new Error('Invalid response format from AI');
      }

      if (suggestions.suggestions && suggestions.suggestions.length > 0) {
        setGiftData(prev => ({
          ...prev!,
          suggestions: suggestions.suggestions
        }));
      } else {
        throw new Error('No suggestions received from AI');
      }

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
    localStorage.removeItem(GIFT_DATA_STORAGE_KEY);
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

