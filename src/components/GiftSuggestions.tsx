'use client';

import { useCallback, memo } from 'react';

interface GiftSuggestion {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  reason: string;
}

interface GiftData {
  recipient: {
    name: string;
    relationship: string;
    age: string;
    interests: string[];
    budget: string;
    occasion: string;
    additionalInfo: string;
  };
  suggestions: GiftSuggestion[];
}

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

  const getCategoryIcon = useCallback((category: string) => {
    const icons: { [key: string]: string } = {
      'Technology': '💻',
      'Kitchen & Cooking': '🍳',
      'Books & Reading': '📚',
      'Health & Fitness': '💪',
      'Arts & Crafts': '🎨',
      'Office & Professional': '💼',
      'Experiences': '🎉',
      'Personalized': '🎁'
    };
    return icons[category] || '🎁';
  }, []);

  const getBudgetLabel = useCallback((budget: string) => {
    const labels: { [key: string]: string } = {
      'low': 'Under $50',
      'medium': '$50-150',
      'high': '$150+'
    };
    return labels[budget] || budget;
  }, []);

  const handleSaveGift = useCallback((gift: GiftSuggestion) => {
    onSaveGift(gift);
  }, [onSaveGift]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 gradient-magic rounded-3xl mb-6 animate-pulse-glow">
          <span className="text-3xl">🎁</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
          Gift Suggestions for {recipient.name}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="glass-text px-4 py-2 rounded-full text-purple-200 font-medium">
            {recipient.relationship.charAt(0).toUpperCase() + recipient.relationship.slice(1)}
          </span>
          <span className="glass-text px-4 py-2 rounded-full text-purple-200 font-medium">
            {recipient.age.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="glass-text px-4 py-2 rounded-full text-purple-200 font-medium">
            {getBudgetLabel(recipient.budget)}
          </span>
          <span className="glass-text px-4 py-2 rounded-full text-purple-200 font-medium">
            {recipient.occasion.charAt(0).toUpperCase() + recipient.occasion.slice(1)}
          </span>
          <span className="gradient-primary text-white px-4 py-2 rounded-full font-medium animate-pulse">
            🤖 AI-Powered
          </span>
        </div>
      </div>

      {/* Recipient Summary */}
      <div className="glass rounded-3xl shadow-2xl p-8 mb-12 animate-float">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 gradient-secondary rounded-2xl flex items-center justify-center mr-4">
            <span className="text-xl">👤</span>
          </div>
          <h3 className="text-2xl font-bold text-purple-200">About {recipient.name}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-purple-200 mb-4 text-lg">Interests</h4>
            <div className="flex flex-wrap gap-3">
              {recipient.interests.map(interest => (
                <span key={interest} className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200">
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
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

      {/* Gift Suggestions */}
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
            <div className="inline-flex items-center justify-center w-24 h-24 gradient-primary rounded-3xl mb-6 animate-pulse-glow">
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
            {suggestions.map((suggestion, index) => (
              <div 
                key={suggestion.id} 
                className="card-modern glass p-8 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl animate-float">{getCategoryIcon(suggestion.category)}</div>
                  <div className="text-right">
                    <span className="glass-text px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
                      {suggestion.category}
                    </span>
                    <div className="text-xl font-bold gradient-primary bg-clip-text text-transparent mt-2">
                      {suggestion.price}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-purple-200 mb-3 leading-tight">
                  {suggestion.name}
                </h4>
                
                <p className="text-purple-300 mb-6 text-sm leading-relaxed">
                  {suggestion.description}
                </p>
                
                <div className="glass-text rounded-2xl p-4 mb-6">
                  <p className="text-sm text-purple-200 leading-relaxed">
                    <span className="font-semibold">Why this gift:</span> {suggestion.reason}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => onViewDetail(suggestion)}
                    className="flex-1 btn-modern gradient-primary text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleSaveGift(suggestion)}
                    disabled={savedGiftIds.has(suggestion.id)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                      savedGiftIds.has(suggestion.id)
                        ? 'glass-text text-green-400 cursor-not-allowed'
                        : 'glass-text text-purple-200 hover:bg-purple-500/20'
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

      {/* Action Buttons */}
      <div className="text-center space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="btn-modern gradient-primary text-white font-semibold py-4 px-8 rounded-xl text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
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
            className="btn-modern glass border-2 border-purple-500 text-purple-200 font-semibold py-4 px-8 rounded-xl text-lg hover:bg-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Generate New Gift</span>
            </div>
          </button>
        </div>
        
        <div className="glass-text rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm leading-relaxed">
            Not satisfied with these suggestions? Try regenerating to get fresh ideas that avoid your already saved gifts, or add more details about the recipient to get even better recommendations!
          </p>
        </div>
      </div>
    </div>
  );
});

export default GiftSuggestions; 