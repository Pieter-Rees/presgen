'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

function MockAd({ adFormat, style, className }: { adFormat: string; style?: React.CSSProperties; className?: string }) {
  const getDimensions = () => {
    switch (adFormat) {
      case 'rectangle':
        return { width: '300px', height: '250px' };
      case 'vertical':
        return { width: '160px', height: '600px' };
      case 'horizontal':
        return { width: '728px', height: '90px' };
      default:
        return { width: '728px', height: '90px' };
    }
  };

  const dimensions = getDimensions();
  const isRectangle = adFormat === 'rectangle';
  const isHorizontal = adFormat === 'horizontal';
  const padding = isRectangle ? 'p-6' : isHorizontal ? 'p-4' : 'p-8';

  return (
    <div 
      className={`bg-white border border-slate-200 ${padding} rounded-lg hover:shadow-2xl transition-all hover:scale-105 w-full ${className}`}
      style={{
        minHeight: style?.minHeight || dimensions.height,
        ...style,
        width: '100%',
      }}
    >
      {isRectangle && (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">📢</div>
            <div className="text-right">
              <span className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-3 py-1">Advertisement</span>
              <div className="text-lg font-black text-indigo-600 mt-2">Mock Ad</div>
            </div>
          </div>
          <h4 className="text-xl font-black text-slate-900 mb-3 leading-tight uppercase">
            Test Advertisement
          </h4>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed font-semibold">
            This is a placeholder ad for testing purposes. It matches the design of gift cards.
          </p>
          <div className="bg-white border border-indigo-200 rounded-lg p-4 mb-4">
            <div className="bg-blue-100 text-blue-700 rounded-full text-xs px-2 py-0.5 mb-2 inline-block">AD INFO</div>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              Format: {adFormat} ({dimensions.width} × {dimensions.height})
            </p>
          </div>
        </>
      )}
      {isHorizontal && (
        <div className="flex items-center gap-4">
          <div className="text-3xl flex-shrink-0">📢</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-3 py-1">Advertisement</span>
              <div className="text-lg font-black text-indigo-600">Mock Ad</div>
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase">
              Test Advertisement
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-semibold">
              Placeholder ad - {dimensions.width} × {dimensions.height}
            </p>
          </div>
        </div>
      )}
      {!isRectangle && !isHorizontal && (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">📢</div>
            <div className="text-right">
              <span className="bg-indigo-100 text-indigo-700 rounded-full text-xs px-3 py-1">Advertisement</span>
              <div className="text-lg font-black text-indigo-600 mt-2">Mock Ad</div>
            </div>
          </div>
          <h4 className="text-xl font-black text-slate-900 mb-3 leading-tight uppercase">
            Test Advertisement
          </h4>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed font-semibold">
            This is a placeholder ad for testing purposes.
          </p>
          <div className="bg-white border border-indigo-200 rounded-lg p-4">
            <div className="bg-blue-100 text-blue-700 rounded-full text-xs px-2 py-0.5 mb-2 inline-block">AD INFO</div>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              Format: {adFormat} ({dimensions.width} × {dimensions.height})
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto',
  style = { display: 'block' },
  className = ''
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!adSenseId || !adRef.current) return;

    try {
      const windowWithAds = window as Window & { adsbygoogle?: Array<Record<string, unknown>> };
      windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || [];
      windowWithAds.adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [adSenseId]);

  if (!adSenseId) {
    return <MockAd adFormat={adFormat} style={style} className={className} />;
  }

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adSenseId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

