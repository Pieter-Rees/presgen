'use client';

import { memo } from 'react';
import type { GiftData, GiftSuggestion } from '@/types/gift';
import { getBudgetLabel, capitalizeFirst, formatAgeRange } from '@/utils/formatting';
import GiftCard from '@/components/ui/GiftCard';
import AdSense from '@/components/AdSense';

interface GiftSuggestionsProps {
  giftData: GiftData;
  onReset: () => void;
  onRegenerate: () => void;
  isGenerating: boolean;
  onSaveGift: (gift: GiftSuggestion) => void;
  savedGiftIds: Set<number>;
  onViewDetail: (gift: GiftSuggestion) => void;
}

const GiftSuggestions = memo(function GiftSuggestions({ 
  giftData, 
  onReset, 
  onRegenerate, 
  isGenerating, 
  onSaveGift,
  savedGiftIds,
  onViewDetail
}: GiftSuggestionsProps) {
  const { recipient, suggestions } = giftData;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="bg-red-100 text-red-700 rounded-full text-xs px-8 py-1">
GIFT SUGGESTIONS READY
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-slate-200 rounded-lg mb-6 mt-6">
          <span className="text-3xl">🎁</span>
        </div>
        <h2 className="text-4xl font-black text-indigo-600 mb-6 uppercase tracking-tight">
          Gift Suggestions for {recipient.name}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-4 py-2">
            {capitalizeFirst(recipient.relationship)}
          </span>
          <span className="bg-blue-100 text-blue-700 rounded-full text-xs px-4 py-2">
            {formatAgeRange(recipient.age)}
          </span>
          <span className="bg-green-100 text-green-700 rounded-full text-xs px-4 py-2">
            {getBudgetLabel(recipient.budget)}
          </span>
          <span className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-4 py-2">
            {capitalizeFirst(recipient.occasion)}
          </span>
          <span className="bg-indigo-600 text-white px-4 py-2 font-bold uppercase tracking-wide rounded-lg">
            🤖 AI-Powered
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center mr-4">
            <span className="text-xl">👤</span>
          </div>
          <h3 className="text-2xl font-black text-indigo-600 uppercase tracking-tight">About {recipient.name}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-blue-100 text-blue-700 rounded-full text-xs px-3 py-1 mb-4 inline-block">INTERESTS</div>
            <div className="flex flex-wrap gap-3">
              {recipient.interests.map((interest, index) => (
                <span key={interest} className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-3 py-1">
                  #{index + 1} {capitalizeFirst(interest)}
                </span>
              ))}
            </div>
          </div>
          {recipient.additionalInfo && (
            <div>
              <div className="bg-green-100 text-green-700 rounded-full text-xs px-3 py-1 mb-4 inline-block">ADDITIONAL NOTES</div>
              <p className="text-slate-600 leading-relaxed font-semibold">{recipient.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="bg-blue-100 text-blue-700 rounded-full text-xs px-6 py-1 mb-4 inline-block">RECOMMENDATIONS</div>
          <h3 className="text-3xl font-black text-indigo-600 mb-4 uppercase tracking-tight">
            AI-Generated Gift Suggestions
          </h3>
          <div className="inline-block mb-2">
            <p className="text-slate-600 text-lg font-semibold">
              Carefully curated based on {recipient.name}&apos;s preferences and interests
            </p>
          </div>
          {savedGiftIds.size > 0 && (
            <p className="text-slate-500 text-sm font-semibold mt-2">
              💡 Already saved {savedGiftIds.size} gift(s) for {recipient.name} - new suggestions will avoid duplicates
            </p>
          )}
        </div>
        
        {isGenerating ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white border border-slate-200 rounded-lg mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            </div>
            <h4 className="text-xl font-black text-indigo-600 mb-2 uppercase">
              AI is analyzing preferences...
            </h4>
            <p className="text-slate-600 font-semibold">
              This usually takes 10-15 seconds
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <AdSense 
                adSlot="1234567890"
                adFormat="horizontal"
                className="w-full max-w-728px"
                style={{ display: 'block', minHeight: '90px' }}
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suggestions.flatMap((suggestion, index) => {
                const items = [
                  <GiftCard
                    key={suggestion.id}
                    gift={suggestion}
                    budget={recipient.budget}
                    onViewDetail={() => onViewDetail(suggestion)}
                    onSave={() => onSaveGift(suggestion)}
                    isSaved={savedGiftIds.has(suggestion.id)}
                    size="md"
                  />
                ];
                
                if (index === 2) {
                  items.push(
                    <div key={`ad-${index}`} className="w-full">
                      <AdSense 
                        adSlot="1234567891"
                        adFormat="rectangle"
                        className="w-full"
                        style={{ display: 'block', minHeight: '250px' }}
                      />
                    </div>
                  );
                }
                
                return items;
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <AdSense 
                adSlot="1234567892"
                adFormat="horizontal"
                className="w-full max-w-728px"
                style={{ display: 'block', minHeight: '90px' }}
              />
            </div>
          </>
        )}
      </div>

      <div className="text-center space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="bg-indigo-600 text-white font-black py-4 px-8 rounded-lg text-lg uppercase tracking-wide hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Regenerating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🔄</span>
                <span>Regenerate (Avoids Saved)</span>
              </div>
            )}
          </button>
          
          <button
            onClick={onReset}
            disabled={isGenerating}
            className="bg-white border-2 border-indigo-600 text-indigo-600 font-black py-4 px-8 rounded-lg text-lg uppercase tracking-wide hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Generate New Gift</span>
            </div>
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="bg-green-100 text-green-700 rounded-full text-xs px-3 py-1 mb-3 inline-block">TIP</div>
          <p className="text-slate-600 text-sm leading-relaxed font-semibold">
            Not satisfied with these suggestions? Try regenerating to get fresh ideas that avoid your already saved gifts, or add more details about the recipient to get even better recommendations!
          </p>
        </div>
      </div>
    </div>
  );
});

export default GiftSuggestions; 