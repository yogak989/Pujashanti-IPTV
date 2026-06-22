import { useEffect, useRef } from 'react';

export default function BannerAd() {
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Check if already initialized to avoid "All 'ins' elements... already have ads in them"
    if (adRef.current.getAttribute('data-adsbygoogle-status') === 'done') {
      return;
    }

    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error("AdSense init failed", e);
    }
  }, []);

  return (
    <div className="mt-4 p-4 bg-[#1a1a1a] border border-white/10 rounded flex justify-center">
      <ins ref={adRef} className="adsbygoogle"
           style={{ display: 'block', minHeight: '100px' }}
           data-ad-client="ca-app-pub-4663862602910608"
           data-ad-slot="3929315334"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}
