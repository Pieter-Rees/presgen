'use client';

import { useState, useEffect, useCallback } from 'react';
import GiftForm from '@/components/GiftForm';
import GiftSuggestions from '@/components/GiftSuggestions';
import SavedGifts from '@/components/SavedGifts';
import GiftDetail from '@/components/GiftDetail';
import Header from '@/components/Header';

interface GiftFormData {
  name: string;
  relationship: string;
  age: string;
  interests: string[];
  budget: string;
  occasion: string;
  additionalInfo: string;
}

interface GiftSuggestion {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  reason: string;
}

interface SavedGift {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  reason: string;
  recipientName: string;
  savedAt: Date;
}

interface GiftData {
  recipient: GiftFormData;
  suggestions: GiftSuggestion[];
}

type ViewMode = 'generator' | 'saved' | 'detail';

export default function Home() {
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedGifts, setSavedGifts] = useState<SavedGift[]>([]);
  const [savedGiftIds, setSavedGiftIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [selectedGift, setSelectedGift] = useState<GiftSuggestion | SavedGift | null>(null);

  // Load saved gifts from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('presgen-saved-gifts');
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
        // Silently handle localStorage errors
      }
    }
  }, []);

  // Save gifts to localStorage whenever savedGifts changes
  useEffect(() => {
    localStorage.setItem('presgen-saved-gifts', JSON.stringify(savedGifts));
  }, [savedGifts]);

  const handleSaveGift = useCallback((gift: GiftSuggestion) => {
    if (savedGiftIds.has(gift.id)) return; // Already saved

    const savedGift: SavedGift = {
      id: `${gift.id}-${Date.now()}`, // Unique ID
      name: gift.name,
      description: gift.description,
      price: gift.price,
      category: gift.category,
      reason: gift.reason,
      recipientName: giftData?.recipient.name || 'Unknown',
      savedAt: new Date()
    };

    setSavedGifts(prev => [...prev, savedGift]);
    setSavedGiftIds(prev => new Set([...prev, gift.id]));
  }, [savedGiftIds, giftData?.recipient.name]);

  const handleRemoveGift = useCallback((id: string) => {
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

  const handleViewSavedGifts = useCallback(() => {
    setViewMode('saved');
  }, []);

  const handleBackToGenerator = useCallback(() => {
    setViewMode('generator');
  }, []);

  const handleGenerateNewGift = useCallback(() => {
    setViewMode('generator');
    setGiftData(null);
    setError(null);
  }, []);

  const handleViewGiftDetail = useCallback((gift: GiftSuggestion | SavedGift) => {
    setSelectedGift(gift);
    setViewMode('detail');
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedGift(null);
    setViewMode('generator');
  }, []);

  const handleGenerateGifts = useCallback(async (formData: GiftFormData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful gift consultant that provides personalized gift suggestions in JSON format.'
            },
            {
              role: 'user',
              content: `You are an expert gift consultant. Generate 6 personalized gift suggestions for the following person:

Recipient: ${formData.name}
Relationship: ${formData.relationship}
Age Range: ${formData.age}
Interests: ${formData.interests.join(', ')}
Budget: ${formData.budget}
Occasion: ${formData.occasion}
${formData.additionalInfo ? `Additional Information: ${formData.additionalInfo}` : ''}

Please provide 6 gift suggestions in the following JSON format:
{
  "suggestions": [
    {
      "id": 1,
      "name": "Gift Name",
      "description": "Brief description of the gift",
      "price": "Price range (e.g., $50-100)",
      "category": "Category (e.g., Technology, Kitchen & Cooking, Books & Reading, Health & Fitness, Arts & Crafts, Office & Professional, Experiences, Personalized)",
      "reason": "Why this gift is perfect for this person"
    }
  ]
}

Make sure the suggestions are:
1. Within the specified budget range
2. Relevant to their interests and age
3. Appropriate for the relationship and occasion
4. Practical and thoughtful
5. Include a mix of different categories

Respond only with valid JSON, no additional text.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI model');
      }

      // Parse the JSON response from AI
      let suggestions;
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

  const handleRegenerateGifts = useCallback(async () => {
    if (!giftData) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful gift consultant that provides personalized gift suggestions in JSON format.'
            },
            {
              role: 'user',
              content: `You are an expert gift consultant. Generate 6 NEW and DIFFERENT personalized gift suggestions for the following person (avoid repeating previous suggestions):

Recipient: ${giftData.recipient.name}
Relationship: ${giftData.recipient.relationship}
Age Range: ${giftData.recipient.age}
Interests: ${giftData.recipient.interests.join(', ')}
Budget: ${giftData.recipient.budget}
Occasion: ${giftData.recipient.occasion}
${giftData.recipient.additionalInfo ? `Additional Information: ${giftData.recipient.additionalInfo}` : ''}

Please provide 6 NEW gift suggestions in the following JSON format:
{
  "suggestions": [
    {
      "id": 1,
      "name": "Gift Name",
      "description": "Brief description of the gift",
      "price": "Price range (e.g., $50-100)",
      "category": "Category (e.g., Technology, Kitchen & Cooking, Books & Reading, Health & Fitness, Arts & Crafts, Office & Professional, Experiences, Personalized)",
      "reason": "Why this gift is perfect for this person"
    }
  ]
}

Make sure the suggestions are:
1. Within the specified budget range
2. Relevant to their interests and age
3. Appropriate for the relationship and occasion
4. Practical and thoughtful
5. Include a mix of different categories
6. DIFFERENT from previous suggestions

Respond only with valid JSON, no additional text.`
            }
          ],
          temperature: 0.9, // Higher temperature for more variety
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI model');
      }

      // Parse the JSON response from AI
      let suggestions;
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(192,132,252,0.1),transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-float animate-neon"></div>
      <div className="fixed top-40 right-20 w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <Header 
        onViewSavedGifts={handleViewSavedGifts}
        onGenerateNewGift={handleGenerateNewGift}
      />
      
      <main className="relative container mx-auto px-6 py-12 max-w-7xl">
        {viewMode === 'generator' ? (
          !giftData ? (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-24 h-24 gradient-magic rounded-3xl mb-8 animate-pulse-glow">
                  <span className="text-4xl">🎁</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6 leading-tight">
                  Gift Generator
                </h1>
                <p className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed">
                  Discover the perfect gift for your friends, colleagues, and loved ones. 
                  Our AI-powered system creates personalized suggestions just for them.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <span className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200 animate-neon">
                    🤖 AI-Powered
                  </span>
                  <span className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200 animate-neon" style={{ animationDelay: '0.5s' }}>
                    ⚡ Instant Results
                  </span>
                  <span className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200 animate-neon" style={{ animationDelay: '1s' }}>
                    🎯 Personalized
                  </span>
                  <button
                    onClick={handleViewSavedGifts}
                    className="btn-modern gradient-secondary text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 animate-neon cursor-pointer"
                    style={{ animationDelay: '1.5s' }}
                  >
                    💝 {savedGifts.length > 0 ? `View Saved Gifts (${savedGifts.length})` : 'View Saved Gifts'}
                  </button>
                </div>
              </div>
              <GiftForm onSubmit={handleGenerateGifts} isGenerating={isGenerating} />
              {error && (
                <div className="mt-8 text-center">
                  <div className="glass rounded-2xl p-6 max-w-2xl mx-auto border border-red-500/30">
                    <p className="text-red-300 text-lg font-semibold mb-2">❌ Error</p>
                    <p className="text-red-200">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-4 btn-modern gradient-primary text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <GiftSuggestions 
              giftData={giftData} 
              onReset={() => {
                setGiftData(null);
                setError(null);
              }}
              onRegenerate={handleRegenerateGifts}
              isGenerating={isGenerating}
              onSaveGift={handleSaveGift}
              savedGiftIds={savedGiftIds}
              onViewDetail={handleViewGiftDetail}
            />
          )
        ) : viewMode === 'saved' ? (
          <SavedGifts 
            savedGifts={savedGifts}
            onRemoveGift={handleRemoveGift}
            onBack={handleBackToGenerator}
            onViewDetail={handleViewGiftDetail}
          />
        ) : viewMode === 'detail' && selectedGift ? (
          <GiftDetail 
            gift={selectedGift}
            recipient={giftData?.recipient}
            onBack={handleBackFromDetail}
            onSave={selectedGift && 'recipientName' in selectedGift ? undefined : () => handleSaveGift(selectedGift as GiftSuggestion)}
            isSaved={selectedGift && 'recipientName' in selectedGift ? true : savedGiftIds.has((selectedGift as GiftSuggestion).id)}
            onRemove={selectedGift && 'recipientName' in selectedGift ? () => handleRemoveGift(selectedGift.id) : undefined}
          />
        ) : null}
      </main>
      
      {/* Footer */}
      <footer className="relative mt-20 py-8 text-center">
        <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm">
            Made with ❤️ using Next.js, Tailwind CSS, and Claude 3.5 Sonnet
          </p>
        </div>
      </footer>
    </div>
  );
}
