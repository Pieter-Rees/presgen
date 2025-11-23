'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
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
    return null;
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

