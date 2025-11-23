'use client';

import { memo } from 'react';
import GiftForm from '@/components/GiftForm';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import type { GiftFormData } from '@/types/gift';

interface GeneratorViewProps {
  onSubmit: (data: GiftFormData) => void;
  isGenerating: boolean;
  error: string | null;
  onDismissError: () => void;
  prefilledRecipient: GiftFormData | null;
  formSeed: number;
  savedGiftsCount: number;
  onViewSavedGifts: () => void;
}

const GeneratorView = memo(function GeneratorView({
  onSubmit,
  isGenerating,
  error,
  onDismissError,
  prefilledRecipient,
  formSeed,
  savedGiftsCount,
  onViewSavedGifts,
}: GeneratorViewProps) {
  const formKey = `gift-form-${formSeed}`;

  return (
    <>
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full mb-6">
          <span className="text-3xl sm:text-4xl">🎁</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
          Gift Generator
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Discover the perfect gift for your friends, colleagues, and loved ones. 
          Our AI-powered system creates personalized suggestions just for them.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            🤖 AI-Powered
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            ⚡ Instant Results
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            🎯 Personalized
          </span>
          <button
            onClick={onViewSavedGifts}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-300 cursor-pointer"
          >
            💝 {savedGiftsCount > 0 ? `View Saved Gifts (${savedGiftsCount})` : 'View Saved Gifts'}
          </button>
        </div>
      </div>
      <GiftForm 
        key={formKey}
        onSubmit={onSubmit} 
        isGenerating={isGenerating} 
        initialData={prefilledRecipient}
      />
      {error && <ErrorDisplay error={error} onDismiss={onDismissError} />}
    </>
  );
});

export default GeneratorView;

