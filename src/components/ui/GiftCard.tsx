'use client';

import { memo } from 'react';
import type { GiftSuggestion, SavedGift } from '@/types/gift';
import { getCategoryIcon } from '@/utils/icons';
import { getPriceLabel, formatDate } from '@/utils/formatting';

interface GiftCardProps {
  gift: GiftSuggestion | SavedGift;
  budget?: string;
  onViewDetail?: () => void;
  onSave?: () => void;
  onRemove?: () => void;
  isSaved?: boolean;
  showRecipientInfo?: boolean;
  size?: 'sm' | 'md';
}

const GiftCard = memo(function GiftCard({
  gift,
  budget,
  onViewDetail,
  onSave,
  onRemove,
  isSaved = false,
  showRecipientInfo = false,
  size = 'md',
}: GiftCardProps) {
  const padding = size === 'sm' ? 'p-6' : 'p-8';
  const iconSize = size === 'sm' ? 'text-3xl' : 'text-4xl';
  const titleSize = size === 'sm' ? 'text-lg' : 'text-xl';
  const priceSize = size === 'sm' ? 'text-lg' : 'text-xl';
  const reasonPadding = size === 'sm' ? 'p-3' : 'p-4';

  return (
    <div className={`bg-white border border-slate-200 ${padding} rounded-lg hover:shadow-2xl transition-all hover:scale-105`}>
      <div className="flex items-start justify-between mb-4">
        <div className={iconSize}>{getCategoryIcon(gift.category)}</div>
        <div className="text-right">
          <span className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-3 py-1">{gift.category}</span>
          <div className={`${priceSize} font-black text-indigo-600 mt-2`}>
            {getPriceLabel(gift.price, budget)}
          </div>
        </div>
      </div>

      <h4 className={`${titleSize} font-black text-slate-900 mb-3 leading-tight uppercase`}>
        {gift.name}
      </h4>

      <p className="text-slate-600 mb-4 text-sm leading-relaxed font-semibold">
        {gift.description}
      </p>

      <div className={`bg-white border border-indigo-200 rounded-lg ${reasonPadding} mb-4`}>
        <div className="bg-blue-100 text-blue-700 rounded-full text-xs px-2 py-0.5 mb-2 inline-block">WHY THIS GIFT</div>
        <p className="text-sm text-slate-600 leading-relaxed font-semibold">{gift.reason}</p>
      </div>

      {showRecipientInfo && 'recipientName' in gift && 'savedAt' in gift && (
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-semibold">
          <span>For: {gift.recipientName}</span>
          <span>{formatDate(gift.savedAt)}</span>
        </div>
      )}

      <div className="flex gap-3">
        {onViewDetail && (
          <button
            onClick={onViewDetail}
            className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            View Details
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaved}
            className={`py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer ${
              isSaved
                ? 'bg-white border-2 border-green-500 text-green-600 cursor-not-allowed'
                : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isSaved ? '✓ Saved' : 'Save'}
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="bg-white border-2 border-red-600 text-red-600 py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-red-50 transition-all duration-300 cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
});

export default GiftCard;

