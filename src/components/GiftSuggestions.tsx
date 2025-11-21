'use client';

import { useCallback, memo } from 'react';
import type { GiftData, GiftSuggestion } from '@/types/gift';
import { getCategoryIcon } from '@/utils/icons';
import { getBudgetLabel, capitalizeFirst, formatAgeRange, getPriceLabel } from '@/utils/formatting';

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

  const handleSaveGift = useCallback((gift: GiftSuggestion) => {
    onSaveGift(gift);
  }, [onSaveGift]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="ribbon ribbon-red text-xs px-8 py-1">
            TARGET ACQUIRED
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-20 h-20 military-badge rounded-lg mb-6 mt-6">
          <span className="text-3xl">🎁</span>
        </div>
        <h2 className="text-4xl font-black text-army-gold military-text mb-6 uppercase tracking-tight">
          Gift Suggestions for {recipient.name}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="ribbon text-xs px-4 py-2">
            {capitalizeFirst(recipient.relationship)}
          </span>
          <span className="ribbon ribbon-blue text-xs px-4 py-2">
            {formatAgeRange(recipient.age)}
          </span>
          <span className="ribbon ribbon-green text-xs px-4 py-2">
            {getBudgetLabel(recipient.budget)}
          </span>
          <span className="ribbon text-xs px-4 py-2">
            {capitalizeFirst(recipient.occasion)}
          </span>
          <span className="military-badge text-army-gold px-4 py-2 font-bold uppercase tracking-wide">
            🤖 AI-Powered
          </span>
        </div>
      </div>

      <div className="military-badge rounded-lg shadow-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 military-badge rounded-lg flex items-center justify-center mr-4">
            <span className="text-xl">👤</span>
          </div>
          <h3 className="text-2xl font-black text-army-gold military-text uppercase tracking-tight">About {recipient.name}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-4 inline-block">INTERESTS</div>
            <div className="flex flex-wrap gap-3">
              {recipient.interests.map((interest, index) => (
                <span key={interest} className="ribbon text-xs px-3 py-1">
                  #{index + 1} {capitalizeFirst(interest)}
                </span>
              ))}
            </div>
          </div>
          {recipient.additionalInfo && (
            <div>
              <div className="ribbon ribbon-green text-xs px-3 py-1 mb-4 inline-block">INTELLIGENCE NOTES</div>
              <p className="text-army-khaki-light leading-relaxed font-semibold">{recipient.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="ribbon ribbon-blue text-xs px-6 py-1 mb-4 inline-block">RECOMMENDATIONS</div>
          <h3 className="text-3xl font-black text-army-gold military-text mb-4 uppercase tracking-tight">
            AI-Generated Gift Suggestions
          </h3>
          <div className="ribbon-decoration inline-block mb-2">
            <p className="text-army-khaki-light text-lg font-semibold">
              Carefully curated based on {recipient.name}&apos;s preferences and interests
            </p>
          </div>
          {savedGiftIds.size > 0 && (
            <p className="text-army-khaki-light/90 text-sm font-semibold mt-2">
              💡 Already saved {savedGiftIds.size} gift(s) for {recipient.name} - new suggestions will avoid duplicates
            </p>
          )}
        </div>
        
        {isGenerating ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 military-badge rounded-lg mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-army-gold"></div>
            </div>
            <h4 className="text-xl font-black text-army-gold military-text mb-2 uppercase">
              AI is analyzing preferences...
            </h4>
            <p className="text-army-khaki-light font-semibold">
              This usually takes 10-15 seconds
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="military-badge p-8 rounded-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl">{getCategoryIcon(suggestion.category)}</div>
                  <div className="text-right">
                    <span className="ribbon text-xs px-3 py-1">
                      {suggestion.category}
                    </span>
                    <div className="text-xl font-black text-army-gold mt-2">
                      {getPriceLabel(suggestion.price, recipient.budget)}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-xl font-black text-army-gold military-text mb-3 leading-tight uppercase">
                  {suggestion.name}
                </h4>
                
                <p className="text-army-khaki-light mb-6 text-sm leading-relaxed font-semibold">
                  {suggestion.description}
                </p>
                
                <div className="military-badge border border-army-gold rounded-lg p-4 mb-6">
                  <div className="ribbon ribbon-blue text-xs px-2 py-0.5 mb-2 inline-block">WHY THIS GIFT</div>
                  <p className="text-sm text-army-khaki-light leading-relaxed font-semibold">
                    {suggestion.reason}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => onViewDetail(suggestion)}
                    className="flex-1 military-badge text-army-gold py-3 px-4 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleSaveGift(suggestion)}
                    disabled={savedGiftIds.has(suggestion.id)}
                    className={`py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer ${
                      savedGiftIds.has(suggestion.id)
                        ? 'military-badge border-2 border-green-500 text-green-400 cursor-not-allowed'
                        : 'military-badge border-2 border-army-gold text-army-khaki hover:bg-army-gold/20'
                    }`}
                  >
                    {savedGiftIds.has(suggestion.id) ? '✓ Saved' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="military-badge text-army-gold font-black py-4 px-8 rounded-lg text-lg uppercase tracking-wide hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-army-gold"></div>
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
            className="military-badge border-2 border-army-gold text-army-khaki font-black py-4 px-8 rounded-lg text-lg uppercase tracking-wide hover:bg-army-gold/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Generate New Gift</span>
            </div>
          </button>
        </div>
        
        <div className="military-badge rounded-lg p-6 max-w-2xl mx-auto">
          <div className="ribbon ribbon-green text-xs px-3 py-1 mb-3 inline-block">INTELLIGENCE REPORT</div>
          <p className="text-army-khaki-light text-sm leading-relaxed font-semibold">
            Not satisfied with these suggestions? Try regenerating to get fresh ideas that avoid your already saved gifts, or add more details about the recipient to get even better recommendations!
          </p>
        </div>
      </div>
    </div>
  );
});

export default GiftSuggestions; 