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
    <div className="min-h-screen relative overflow-hidden camo-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-army-dark/60 via-army-green/40 to-camo-dark/60"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-army-gold to-transparent"></div>
      
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
              <div className="text-center mb-16 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                  <div className="ribbon ribbon-red text-xs px-8 py-1">
                    OPERATION GIFT RECON
                  </div>
                </div>
                <div className="inline-flex items-center justify-center w-24 h-24 military-badge rounded-lg mb-8 mt-6">
                  <span className="text-4xl">🎁</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-army-gold military-text mb-6 leading-tight uppercase tracking-tight">
                  Gift Generator
                </h1>
                <div className="ribbon-decoration inline-block mb-6">
                  <p className="text-xl md:text-2xl text-army-khaki max-w-3xl mx-auto leading-relaxed font-semibold">
                    Discover the perfect gift for your friends, colleagues, and loved ones. 
                    Our AI-powered system creates personalized suggestions just for them.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <span className="ribbon text-xs px-4 py-2">
                    🤖 AI-Powered
                  </span>
                  <span className="ribbon ribbon-blue text-xs px-4 py-2">
                    ⚡ Instant Results
                  </span>
                  <span className="ribbon ribbon-green text-xs px-4 py-2">
                    🎯 Personalized
                  </span>
                  <button
                    onClick={handleViewSavedGifts}
                    className="military-badge text-army-gold px-6 py-2 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all cursor-pointer"
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
                  <div className="military-badge border-2 border-red-600 rounded-lg p-6 max-w-2xl mx-auto bg-red-900/30">
                    <div className="ribbon ribbon-red text-xs px-4 py-1 mb-4 inline-block">⚠️ ALERT</div>
                    <p className="text-red-200 text-lg font-bold mb-2 uppercase">Error</p>
                    <p className="text-red-100">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-4 military-badge text-army-gold px-6 py-2 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all cursor-pointer"
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
        <div className="military-badge rounded-lg p-6 max-w-2xl mx-auto">
          <div className="ribbon text-xs px-4 py-1 mb-3 inline-block">INTELLIGENCE REPORT</div>
          <p className="text-army-khaki text-sm font-semibold">
            Made with ❤️ using Next.js, Tailwind CSS, and Claude 3.5 Sonnet
          </p>
        </div>
      </footer>
    </div>
  );
}
