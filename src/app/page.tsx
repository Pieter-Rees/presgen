'use client';

import { useState, useCallback, useMemo, lazy, Suspense, startTransition } from 'react';
import Header from '@/components/Header';
import GeneratorView from '@/components/views/GeneratorView';
import { useSavedGifts } from '@/hooks/useSavedGifts';
import { useGiftGeneration } from '@/hooks/useGiftGeneration';
import { useSavedRecipients } from '@/hooks/useSavedRecipients';
import type { GiftSuggestion, SavedGift, GiftFormData, SavedRecipient } from '@/types/gift';
import { isSavedGift } from '@/types/gift';
import type { ViewMode } from '@/components/views/ViewMode';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getSavedGiftNames } from '@/lib/giftUtils';

const GiftSuggestions = lazy(() => import('@/components/GiftSuggestions'));
const SavedGifts = lazy(() => import('@/components/SavedGifts'));
const SavedRecipients = lazy(() => import('@/components/SavedRecipients'));
const GiftDetail = lazy(() => import('@/components/GiftDetail'));

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [selectedGift, setSelectedGift] = useState<GiftSuggestion | SavedGift | null>(null);
  const [prefilledRecipient, setPrefilledRecipient] = useState<GiftFormData | null>(null);
  const [formSeed, setFormSeed] = useState(0);

  const { savedGifts, savedGiftIds, saveGift, removeGift, getSavedGiftsForRecipient } = useSavedGifts();
  const { savedRecipients, saveRecipientProfile, removeRecipient } = useSavedRecipients();
  const { giftData, isGenerating, error, generateGifts, regenerateGifts, reset, setError } = useGiftGeneration();

  const recipientName = useMemo(() => giftData?.recipient?.name ?? 'Unknown', [giftData?.recipient?.name]);
  const recipientBudget = useMemo(() => giftData?.recipient?.budget, [giftData?.recipient?.budget]);

  const handleSaveGift = useCallback((gift: GiftSuggestion) => {
    saveGift(gift, recipientName, recipientBudget);
  }, [saveGift, recipientName, recipientBudget]);

  const setViewModeTransition = useCallback((mode: ViewMode) => {
    startTransition(() => setViewMode(mode));
  }, []);

  const handleViewSavedGifts = useCallback(() => setViewModeTransition('saved'), [setViewModeTransition]);
  const handleViewSavedRecipients = useCallback(() => setViewModeTransition('recipients'), [setViewModeTransition]);
  const handleBackToGenerator = useCallback(() => setViewModeTransition('generator'), [setViewModeTransition]);
  
  const handleGenerateNewGift = useCallback(() => {
    setViewModeTransition('generator');
    reset();
  }, [reset, setViewModeTransition]);

  const handleViewGiftDetail = useCallback((gift: GiftSuggestion | SavedGift) => {
    startTransition(() => {
      setSelectedGift(gift);
      setViewMode('detail');
    });
  }, []);

  const handleBackFromDetail = useCallback(() => {
    startTransition(() => {
      setSelectedGift(null);
      setViewMode('generator');
    });
  }, []);

  const handleGenerateGifts = useCallback(async (formData: GiftFormData) => {
    const savedGiftsForRecipient = getSavedGiftsForRecipient(formData.name);
    await generateGifts(formData, getSavedGiftNames(savedGiftsForRecipient));
    saveRecipientProfile(formData);
  }, [generateGifts, getSavedGiftsForRecipient, saveRecipientProfile]);

  const handleRegenerateGifts = useCallback(async () => {
    if (!giftData) return;
    const savedGiftsForRecipient = getSavedGiftsForRecipient(giftData.recipient.name);
    await regenerateGifts(getSavedGiftNames(savedGiftsForRecipient));
  }, [giftData, regenerateGifts, getSavedGiftsForRecipient]);

  const handleUseRecipientProfile = useCallback((recipient: SavedRecipient) => {
    const { id: _id, savedAt: _savedAt, ...formData } = recipient;
    setPrefilledRecipient(formData);
    setFormSeed(prev => prev + 1);
    setViewMode('generator');
  }, []);

  const detailGiftConfig = useMemo(() => {
    if (!selectedGift) return null;
    
    if (isSavedGift(selectedGift)) {
      return {
        onSave: undefined,
        isSaved: true,
        onRemove: () => removeGift(selectedGift.id),
      };
    }
    
    return {
      onSave: () => handleSaveGift(selectedGift),
      isSaved: savedGiftIds.has(selectedGift.id),
      onRemove: undefined,
    };
  }, [selectedGift, savedGiftIds, handleSaveGift, removeGift]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <Header 
          onViewSavedGifts={handleViewSavedGifts}
          onViewSavedRecipients={handleViewSavedRecipients}
          onGenerateNewGift={handleGenerateNewGift}
          savedGiftsCount={savedGifts.length}
          savedRecipientsCount={savedRecipients.length}
        />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
            {viewMode === 'generator' ? (
              !giftData ? (
                <GeneratorView
                  onSubmit={handleGenerateGifts}
                  isGenerating={isGenerating}
                  error={error}
                  onDismissError={() => setError(null)}
                  prefilledRecipient={prefilledRecipient}
                  formSeed={formSeed}
                  savedGiftsCount={savedGifts.length}
                  onViewSavedGifts={handleViewSavedGifts}
                />
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
          </Suspense>
        </main>
        
        <footer className="mt-16 sm:mt-20 py-8 text-center border-t border-slate-200">
          <div className="rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-slate-600 text-sm">
              Made with ❤️ using Next.js, Tailwind CSS, and Claude 3.5 Sonnet
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
