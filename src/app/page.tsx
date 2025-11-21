'use client';

import { useState, useCallback } from 'react';
import GiftForm from '@/components/GiftForm';
import GiftSuggestions from '@/components/GiftSuggestions';
import SavedGifts from '@/components/SavedGifts';
import GiftDetail from '@/components/GiftDetail';
import Header from '@/components/Header';
import { useSavedGifts } from '@/hooks/useSavedGifts';
import { useGiftGeneration } from '@/hooks/useGiftGeneration';
import type { ViewMode, GiftSuggestion, SavedGift, GiftFormData } from '@/types/gift';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [selectedGift, setSelectedGift] = useState<GiftSuggestion | SavedGift | null>(null);
  
  const { savedGifts, savedGiftIds, saveGift, removeGift, getSavedGiftsForRecipient } = useSavedGifts();
  const { giftData, isGenerating, error, generateGifts, regenerateGifts, reset, setError } = useGiftGeneration();

  const handleSaveGift = useCallback((gift: GiftSuggestion) => {
    const recipientName = giftData?.recipient.name || 'Unknown';
    saveGift(gift, recipientName);
  }, [saveGift, giftData?.recipient.name]);

  const handleViewSavedGifts = useCallback(() => {
    setViewMode('saved');
  }, []);

  const handleBackToGenerator = useCallback(() => {
    setViewMode('generator');
  }, []);

  const handleGenerateNewGift = useCallback(() => {
    setViewMode('generator');
    reset();
  }, [reset]);

  const handleViewGiftDetail = useCallback((gift: GiftSuggestion | SavedGift) => {
    setSelectedGift(gift);
    setViewMode('detail');
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedGift(null);
    setViewMode('generator');
  }, []);

  const handleGenerateGifts = useCallback(async (formData: GiftFormData) => {
    const savedGiftsForRecipient = getSavedGiftsForRecipient(formData.name);
    const savedGiftNames = savedGiftsForRecipient.map(gift => gift.name);
    await generateGifts(formData, savedGiftNames);
  }, [generateGifts, getSavedGiftsForRecipient]);

  const handleRegenerateGifts = useCallback(async () => {
    if (!giftData) return;
    const savedGiftsForRecipient = getSavedGiftsForRecipient(giftData.recipient.name);
    const savedGiftNames = savedGiftsForRecipient.map(gift => gift.name);
    await regenerateGifts(savedGiftNames);
  }, [giftData, regenerateGifts, getSavedGiftsForRecipient]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(192,132,252,0.1),transparent_50%)]"></div>
      
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-float animate-neon"></div>
      <div className="fixed top-40 right-20 w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
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
              onReset={reset}
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
            onRemoveGift={removeGift}
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
            onRemove={selectedGift && 'recipientName' in selectedGift ? () => removeGift(selectedGift.id) : undefined}
          />
        ) : null}
      </main>
      
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
