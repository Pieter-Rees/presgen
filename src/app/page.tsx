'use client';

import { useState, useCallback } from 'react';
import GiftForm from '@/components/GiftForm';
import GiftSuggestions from '@/components/GiftSuggestions';
import SavedGifts from '@/components/SavedGifts';
import GiftDetail from '@/components/GiftDetail';
import Header from '@/components/Header';
import { useSavedGifts } from '@/hooks/useSavedGifts';
import { useGiftGeneration } from '@/hooks/useGiftGeneration';
import { useSavedRecipients } from '@/hooks/useSavedRecipients';
import SavedRecipients from '@/components/SavedRecipients';
import type { ViewMode, GiftSuggestion, SavedGift, GiftFormData, SavedRecipient } from '@/types/gift';
import { isSavedGift } from '@/types/gift';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [selectedGift, setSelectedGift] = useState<GiftSuggestion | SavedGift | null>(null);
  const [prefilledRecipient, setPrefilledRecipient] = useState<GiftFormData | null>(null);
  const [formSeed, setFormSeed] = useState(0);

  const { savedGifts, savedGiftIds, saveGift, removeGift, getSavedGiftsForRecipient } = useSavedGifts();
  const { savedRecipients, saveRecipientProfile, removeRecipient } = useSavedRecipients();
  const { giftData, isGenerating, error, generateGifts, regenerateGifts, reset, setError } = useGiftGeneration();

  const recipientName = giftData?.recipient?.name ?? 'Unknown';
  const recipientBudget = giftData?.recipient?.budget;

  const handleSaveGift = useCallback((gift: GiftSuggestion) => {
    saveGift(gift, recipientName, recipientBudget);
  }, [saveGift, recipientName, recipientBudget]);

  const handleViewSavedGifts = useCallback(() => {
    setViewMode('saved');
  }, []);

  const handleViewSavedRecipients = useCallback(() => {
    setViewMode('recipients');
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
    saveRecipientProfile(formData);
  }, [generateGifts, getSavedGiftsForRecipient, saveRecipientProfile]);

  const handleRegenerateGifts = useCallback(async () => {
    if (!giftData) return;
    const savedGiftsForRecipient = getSavedGiftsForRecipient(giftData.recipient.name);
    const savedGiftNames = savedGiftsForRecipient.map(gift => gift.name);
    await regenerateGifts(savedGiftNames);
  }, [giftData, regenerateGifts, getSavedGiftsForRecipient]);

  const handleUseRecipientProfile = useCallback((recipient: SavedRecipient) => {
    const { id: _id, savedAt: _savedAt, ...formData } = recipient;
    setPrefilledRecipient(formData);
    setFormSeed(prev => prev + 1);
    setViewMode('generator');
  }, []);

  const detailGiftConfig = selectedGift
    ? isSavedGift(selectedGift)
      ? {
          onSave: undefined,
          isSaved: true,
          onRemove: () => removeGift(selectedGift.id),
        }
      : {
          onSave: () => handleSaveGift(selectedGift),
          isSaved: savedGiftIds.has(selectedGift.id),
          onRemove: undefined,
        }
    : null;

  const formKey = `gift-form-${formSeed}`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      
      <Header 
        onViewSavedGifts={handleViewSavedGifts}
        onViewSavedRecipients={handleViewSavedRecipients}
        onGenerateNewGift={handleGenerateNewGift}
        savedGiftsCount={savedGifts.length}
        savedRecipientsCount={savedRecipients.length}
      />
      
      <main className="relative container mx-auto px-6 py-12 max-w-7xl">
        {viewMode === 'generator' ? (
          !giftData ? (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl mb-8">
                  <span className="text-4xl">🎁</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6 leading-tight">
                  Gift Generator
                </h1>
                <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
                  Discover the perfect gift for your friends, colleagues, and loved ones. 
                  Our AI-powered system creates personalized suggestions just for them.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-purple-200">
                    🤖 AI-Powered
                  </span>
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-purple-200">
                    ⚡ Instant Results
                  </span>
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-purple-200">
                    🎯 Personalized
                  </span>
                  <button
                    onClick={handleViewSavedGifts}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
                  >
                    💝 {savedGifts.length > 0 ? `View Saved Gifts (${savedGifts.length})` : 'View Saved Gifts'}
                  </button>
                </div>
              </div>
              <GiftForm 
                key={formKey}
                onSubmit={handleGenerateGifts} 
                isGenerating={isGenerating} 
                initialData={prefilledRecipient}
              />
              {error && (
                <div className="mt-8 text-center">
                  <div className="bg-white/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
                    <p className="text-red-300 text-lg font-semibold mb-2">❌ Error</p>
                    <p className="text-red-200">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
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
        ) : viewMode === 'recipients' ? (
          <SavedRecipients
            recipients={savedRecipients}
            onBack={handleBackToGenerator}
            onUseRecipient={handleUseRecipientProfile}
            onRemoveRecipient={removeRecipient}
          />
        ) : viewMode === 'detail' && selectedGift && detailGiftConfig ? (
          <GiftDetail 
            gift={selectedGift}
            recipient={giftData?.recipient}
            onBack={handleBackFromDetail}
            onSave={detailGiftConfig.onSave}
            isSaved={detailGiftConfig.isSaved}
            onRemove={detailGiftConfig.onRemove}
          />
        ) : null}
      </main>
      
      <footer className="relative mt-20 py-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm">
            Made with ❤️ using Next.js, Tailwind CSS, and Claude 3.5 Sonnet
          </p>
        </div>
      </footer>
    </div>
  );
}
