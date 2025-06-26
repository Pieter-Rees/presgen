'use client';

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
  isAIPowered?: boolean;
}

export default function GiftSuggestions({ giftData, onReset, onRegenerate, isGenerating, isAIPowered = true }: GiftSuggestionsProps) {
  const { recipient, suggestions } = giftData;

  const getCategoryIcon = (category: string) => {
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
  };

  const getBudgetLabel = (budget: string) => {
    const labels: { [key: string]: string } = {
      'low': 'Under $50',
      'medium': '$50-150',
      'high': '$150+'
    };
    return labels[budget] || budget;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Gift Suggestions for {recipient.name}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {recipient.relationship.charAt(0).toUpperCase() + recipient.relationship.slice(1)}
          </span>
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
            {recipient.age.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {getBudgetLabel(recipient.budget)}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            {recipient.occasion.charAt(0).toUpperCase() + recipient.occasion.slice(1)}
          </span>
          {isAIPowered && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full">
              🤖 AI-Powered
            </span>
          )}
        </div>
      </div>

      {/* Recipient Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About {recipient.name}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {recipient.interests.map(interest => (
                <span key={interest} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
                </span>
              ))}
            </div>
          </div>
          {recipient.additionalInfo && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Additional Notes</h4>
              <p className="text-gray-600 text-sm">{recipient.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Gift Suggestions */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isAIPowered ? 'AI-Generated Gift Suggestions' : 'Personalized Gift Suggestions'}
        </h3>
        
        {isGenerating ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isAIPowered ? 'AI is analyzing and generating personalized gift suggestions...' : 'Generating personalized gift suggestions...'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{getCategoryIcon(suggestion.category)}</div>
                  <div className="text-right">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      {suggestion.category}
                    </span>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      {suggestion.price}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {suggestion.name}
                </h4>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {suggestion.description}
                </p>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Why this gift:</span> {suggestion.reason}
                  </p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    View Details
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Regenerating...</span>
              </div>
            ) : (
              '🔄 Regenerate Suggestions'
            )}
          </button>
          
          <button
            onClick={onReset}
            disabled={isGenerating}
            className="bg-white border-2 border-purple-600 text-purple-600 font-semibold py-3 px-8 rounded-lg hover:bg-purple-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ Generate New Gift
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Not satisfied with these suggestions? Try regenerating or add more details about the recipient!</p>
        </div>
      </div>

      {/* AI Info */}
      {isAIPowered && (
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Powered by AI</h4>
          <p className="text-gray-600">
            These suggestions are generated using Claude 3.5 Sonnet via OpenRouter, 
            providing personalized and thoughtful gift recommendations just for you.
          </p>
        </div>
      )}
    </div>
  );
} 