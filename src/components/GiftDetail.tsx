'use client';

import { memo } from 'react';

interface GiftDetailProps {
  gift: {
    id: string | number;
    name: string;
    description: string;
    price: string;
    category: string;
    reason: string;
    recipientName?: string;
    savedAt?: Date;
  };
  recipient?: {
    name: string;
    relationship: string;
    age: string;
    interests: string[];
    budget: string;
    occasion: string;
    additionalInfo: string;
  };
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  onRemove?: () => void;
}

const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    'Technology': '💻',
    'Kitchen & Cooking': '🍳',
    'Books & Reading': '📚',
    'Health & Fitness': '💪',
    'Arts & Crafts': '🎨',
    'Office & Professional': '💼',
    'Experiences': '🎭',
    'Personalized': '🎯',
    'Fashion & Beauty': '👗',
    'Sports & Outdoors': '⚽',
    'Home & Garden': '🏠',
    'Music': '🎵',
    'Gaming': '🎮',
    'Travel': '✈️',
    'Food & Beverages': '🍷',
    'Pets': '🐕',
    'Education': '🎓',
    'Entertainment': '🎬'
  };
  return icons[category] || '🎁';
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const GiftDetail = memo(function GiftDetail({ 
  gift, 
  recipient, 
  onBack, 
  onSave, 
  isSaved, 
  onRemove 
}: GiftDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 gradient-magic rounded-3xl mb-6 animate-pulse-glow">
          <span className="text-4xl">{getCategoryIcon(gift.category)}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          {gift.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <span className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200">
            {gift.category}
          </span>
          <span className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200">
            {gift.price}
          </span>
          {gift.savedAt && (
            <span className="glass-text px-4 py-2 rounded-full text-sm font-medium text-purple-200">
              Saved {formatDate(gift.savedAt)}
            </span>
          )}
        </div>
        
        <button
          onClick={onBack}
          className="btn-modern gradient-secondary text-white font-semibold py-3 px-6 rounded-xl text-lg hover:shadow-xl transition-all duration-300 mb-8 cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Gift Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gift Description */}
          <div className="glass rounded-3xl shadow-2xl p-8 animate-float">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mr-4">
                <span className="text-xl">📦</span>
              </div>
              <h2 className="text-2xl font-bold text-purple-200">Gift Details</h2>
            </div>
            <p className="text-purple-300 text-lg leading-relaxed mb-6">
              {gift.description}
            </p>
            <div className="glass-text rounded-2xl p-6">
              <h3 className="font-semibold text-purple-200 mb-3 text-lg">Why This Gift is Perfect</h3>
              <p className="text-purple-300 leading-relaxed">
                {gift.reason}
              </p>
            </div>
          </div>

          {/* Recipient Information */}
          {recipient && (
            <div className="glass rounded-3xl shadow-2xl p-8 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 gradient-secondary rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-purple-200">About {recipient.name}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-purple-200 mb-3">Basic Info</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Relationship:</span>
                      <span className="text-purple-200 font-medium">{recipient.relationship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Age Range:</span>
                      <span className="text-purple-200 font-medium">{recipient.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Budget:</span>
                      <span className="text-purple-200 font-medium">{recipient.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Occasion:</span>
                      <span className="text-purple-200 font-medium">{recipient.occasion}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-200 mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipient.interests.map(interest => (
                      <span key={interest} className="glass-text px-3 py-1 rounded-full text-sm font-medium text-purple-200">
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  {recipient.additionalInfo && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-purple-200 mb-2">Additional Notes</h3>
                      <p className="text-purple-300 text-sm leading-relaxed">{recipient.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price and Actions */}
          <div className="glass rounded-3xl shadow-2xl p-6 animate-float" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                {gift.price}
              </div>
              <p className="text-purple-300 text-sm">Estimated Price Range</p>
            </div>
            
            <div className="space-y-3">
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaved}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isSaved
                      ? 'glass-text text-green-400 cursor-not-allowed'
                      : 'btn-modern gradient-primary text-white hover:shadow-lg'
                  }`}
                >
                  {isSaved ? '✓ Saved to Collection' : '💝 Save to Collection'}
                </button>
              )}
              
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="w-full glass-text text-red-400 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all duration-300 cursor-pointer"
                >
                  🗑️ Remove from Collection
                </button>
              )}
            </div>
          </div>

          {/* Gift Features */}
          <div className="glass rounded-3xl shadow-2xl p-6 animate-float" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-semibold text-purple-200 mb-4">Gift Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-purple-300 text-sm">Personalized for recipient</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-purple-300 text-sm">Within budget range</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-purple-300 text-sm">Matches interests</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-purple-300 text-sm">Perfect for occasion</span>
              </div>
            </div>
          </div>

          {/* Category Info */}
          <div className="glass rounded-3xl shadow-2xl p-6 animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">{getCategoryIcon(gift.category)}</div>
              <h3 className="font-semibold text-purple-200 mb-2">{gift.category}</h3>
              <p className="text-purple-300 text-sm">
                This gift falls into the {gift.category.toLowerCase()} category, 
                making it a great choice for someone with related interests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-12 text-center">
        <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm leading-relaxed mb-4">
            Ready to make this gift a reality? You can now search for this item online or visit your favorite stores to purchase it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn-modern gradient-primary text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
              🔍 Search Online
            </button>
            <button className="btn-modern glass border-2 border-purple-500 text-purple-200 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-purple-500/20 transition-all duration-300 cursor-pointer">
              📝 Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GiftDetail; 