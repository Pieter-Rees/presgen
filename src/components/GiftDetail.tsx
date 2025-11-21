'use client';

import { memo, useMemo } from 'react';
import type { GiftFormData, GiftSuggestion, SavedGift } from '@/types/gift';
import { getCategoryIcon } from '@/utils/icons';
import { formatDate, capitalizeFirst, getPriceLabel } from '@/utils/formatting';

interface GiftDetailProps {
  gift: GiftSuggestion | SavedGift;
  recipient?: GiftFormData;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  onRemove?: () => void;
}

const GiftDetail = memo(function GiftDetail({ 
  gift, 
  recipient, 
  onBack, 
  onSave, 
  isSaved, 
  onRemove 
}: GiftDetailProps) {
  const priceLabel = useMemo(() => getPriceLabel(gift.price, recipient?.budget), [gift.price, recipient?.budget]);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="ribbon ribbon-red text-xs px-8 py-1">
            DETAILED INTELLIGENCE REPORT
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-24 h-24 military-badge rounded-lg mb-6 mt-6">
          <span className="text-4xl">{getCategoryIcon(gift.category)}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-army-gold military-text mb-4 uppercase tracking-tight">
          {gift.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <span className="ribbon text-xs px-4 py-2">
            {gift.category}
          </span>
          <span className="ribbon ribbon-blue text-xs px-4 py-2">
            {priceLabel}
          </span>
          {'savedAt' in gift && gift.savedAt && (
            <span className="ribbon ribbon-green text-xs px-4 py-2">
              Saved {formatDate(gift.savedAt, 'long')}
            </span>
          )}
        </div>
        
        <button
          onClick={onBack}
          className="military-badge text-army-gold font-black py-3 px-6 rounded-lg text-lg uppercase tracking-wide hover:scale-105 transition-all duration-300 mb-8 cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="military-badge rounded-lg shadow-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 military-badge rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">📦</span>
              </div>
              <h2 className="text-2xl font-black text-army-gold military-text uppercase tracking-tight">Gift Details</h2>
            </div>
            <p className="text-army-khaki-light text-lg leading-relaxed mb-6 font-semibold">
              {gift.description}
            </p>
            <div className="military-badge border border-army-gold rounded-lg p-6">
              <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-3 inline-block">WHY THIS GIFT IS PERFECT</div>
              <p className="text-army-khaki-light leading-relaxed font-semibold">
                {gift.reason}
              </p>
            </div>
          </div>

          {recipient && (
            <div className="military-badge rounded-lg shadow-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 military-badge rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">👤</span>
                </div>
                <h2 className="text-2xl font-black text-army-gold military-text uppercase tracking-tight">About {recipient.name}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-3 inline-block">BASIC INFO</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-army-khaki-light font-semibold">Relationship:</span>
                      <span className="text-army-gold font-bold uppercase">{recipient.relationship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-army-khaki font-semibold">Age Range:</span>
                      <span className="text-army-gold font-bold">{recipient.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-army-khaki font-semibold">Budget:</span>
                      <span className="text-army-gold font-bold">{recipient.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-army-khaki font-semibold">Occasion:</span>
                      <span className="text-army-gold font-bold uppercase">{recipient.occasion}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="ribbon ribbon-green text-xs px-3 py-1 mb-3 inline-block">INTERESTS</div>
                  <div className="flex flex-wrap gap-2">
                    {recipient.interests.map((interest, index) => (
                      <span key={interest} className="ribbon text-xs px-3 py-1">
                        #{index + 1} {capitalizeFirst(interest)}
                      </span>
                    ))}
                  </div>
                  
                  {recipient.additionalInfo && (
                    <div className="mt-4">
                      <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-2 inline-block">ADDITIONAL NOTES</div>
                      <p className="text-army-khaki-light text-sm leading-relaxed font-semibold">{recipient.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="military-badge rounded-lg shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="ribbon text-xs px-4 py-1 mb-3 inline-block">PRICE RANGE</div>
              <div className="text-3xl font-black text-army-gold mb-2">
                {priceLabel}
              </div>
              <p className="text-army-khaki-light text-sm font-semibold">Estimated Price Range</p>
            </div>
            
            <div className="space-y-3">
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaved}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer ${
                    isSaved
                      ? 'military-badge border-2 border-green-500 text-green-400 cursor-not-allowed'
                      : 'military-badge text-army-gold hover:scale-105'
                  }`}
                >
                  {isSaved ? '✓ Saved to Collection' : '💝 Save to Collection'}
                </button>
              )}
              
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="w-full military-badge border-2 border-red-600 text-red-400 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-red-600/20 transition-all duration-300 cursor-pointer"
                >
                  🗑️ Remove from Collection
                </button>
              )}
            </div>
          </div>

          <div className="military-badge rounded-lg shadow-2xl p-6">
            <div className="ribbon ribbon-blue text-xs px-3 py-1 mb-4 inline-block">GIFT FEATURES</div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 military-badge rounded-lg flex items-center justify-center">
                  <span className="text-sm text-army-gold font-bold">✓</span>
                </div>
                <span className="text-army-khaki-light text-sm font-semibold">Personalized for recipient</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 military-badge rounded-lg flex items-center justify-center">
                  <span className="text-sm text-army-gold font-bold">✓</span>
                </div>
                <span className="text-army-khaki text-sm font-semibold">Within budget range</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 military-badge rounded-lg flex items-center justify-center">
                  <span className="text-sm text-army-gold font-bold">✓</span>
                </div>
                <span className="text-army-khaki text-sm font-semibold">Matches interests</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 military-badge rounded-lg flex items-center justify-center">
                  <span className="text-sm text-army-gold font-bold">✓</span>
                </div>
                <span className="text-army-khaki text-sm font-semibold">Perfect for occasion</span>
              </div>
            </div>
          </div>

          <div className="military-badge rounded-lg shadow-2xl p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">{getCategoryIcon(gift.category)}</div>
              <div className="ribbon text-xs px-3 py-1 mb-2 inline-block">{gift.category}</div>
              <p className="text-army-khaki-light text-sm font-semibold">
                This gift falls into the {gift.category.toLowerCase()} category, 
                making it a great choice for someone with related interests.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="military-badge rounded-lg p-6 max-w-2xl mx-auto">
          <div className="ribbon ribbon-green text-xs px-3 py-1 mb-4 inline-block">NEXT STEPS</div>
          <p className="text-army-khaki-light text-sm leading-relaxed mb-4 font-semibold">
            Ready to make this gift a reality? You can now search for this item online or visit your favorite stores to purchase it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="military-badge text-army-gold px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer">
              🔍 Search Online
            </button>
            <button className="military-badge border-2 border-army-gold text-army-khaki px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-army-gold/20 transition-all duration-300 cursor-pointer">
              📝 Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GiftDetail; 