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
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl mb-6">
          <span className="text-3xl">🎁</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
          Gift Suggestions for {recipient.name}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-purple-200 font-medium">
            {capitalizeFirst(recipient.relationship)}
          </span>
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-purple-200 font-medium">
            {formatAgeRange(recipient.age)}
          </span>
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-purple-200 font-medium">
            {getBudgetLabel(recipient.budget)}
          </span>
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-purple-200 font-medium">
            {capitalizeFirst(recipient.occasion)}
          </span>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium">
            🤖 AI-Powered
          </span>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-xl">👤</span>
          </div>
          <h3 className="text-2xl font-bold text-purple-200">About {recipient.name}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-purple-200 mb-4 text-lg">Interests</h4>
            <div className="flex flex-wrap gap-3">
              {recipient.interests.map(interest => (
                <span key={interest} className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-purple-200">
                  {capitalizeFirst(interest)}
                </span>
              ))}
            </div>
          </div>
          {recipient.additionalInfo && (
            <div>
              <h4 className="font-semibold text-purple-200 mb-4 text-lg">Additional Notes</h4>
              <p className="text-purple-300 leading-relaxed">{recipient.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI-Generated Gift Suggestions
          </h3>
          <p className="text-purple-200 text-lg mb-2">
            Carefully curated based on {recipient.name}&apos;s preferences and interests
          </p>
          {savedGiftIds.size > 0 && (
            <p className="text-purple-300 text-sm">
              💡 Already saved {savedGiftIds.size} gift(s) for {recipient.name} - new suggestions will avoid duplicates
            </p>
          )}
        </div>
        
        {isGenerating ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
            </div>
            <h4 className="text-xl font-semibold text-purple-200 mb-2">
              AI is analyzing preferences...
            </h4>
            <p className="text-purple-300">
              This usually takes 10-15 seconds
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-lg hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl">{getCategoryIcon(suggestion.category)}</div>
                  <div className="text-right">
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
                      {suggestion.category}
                    </span>
                    <div className="text-xl font-bold text-purple-100 mt-2">
                      {getPriceLabel(suggestion.price, recipient.budget)}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-purple-200 mb-3 leading-tight">
                  {suggestion.name}
                </h4>
                
                <p className="text-purple-300 mb-6 text-sm leading-relaxed">
                  {suggestion.description}
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-purple-200 leading-relaxed">
                    <span className="font-semibold">Why this gift:</span> {suggestion.reason}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => onViewDetail(suggestion)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleSaveGift(suggestion)}
                    disabled={savedGiftIds.has(suggestion.id)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                      savedGiftIds.has(suggestion.id)
                        ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-green-400 cursor-not-allowed'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-purple-200 hover:bg-purple-500/20'
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            className="bg-white/10 backdrop-blur-sm border-2 border-purple-500 text-purple-200 font-semibold py-4 px-8 rounded-xl text-lg hover:bg-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Generate New Gift</span>
            </div>
          </button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm leading-relaxed">
            Not satisfied with these suggestions? Try regenerating to get fresh ideas that avoid your already saved gifts, or add more details about the recipient to get even better recommendations!
          </p>
        </div>
      </div>
    </div>
  );
});

export default GiftSuggestions; 