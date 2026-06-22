import React, { useEffect, useRef } from 'react';

export default function AdSenseAd() {
  const adRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && adRef.current) {
          const attemptPush = () => {
            if (adRef.current && adRef.current.offsetWidth > 0) {
              try {
                if (!(adRef.current as any).hasAttribute('data-adsbygoogle-status')) {
                  ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                }
              } catch (e) {
                console.error("AdSense Error: ", e);
              }
              observer.disconnect();
            } else {
              // Retry shortly if not ready
              setTimeout(attemptPush, 500);
            }
          };
          attemptPush();
        }
      });
    }, { rootMargin: '200px' });

    if (adRef.current) {
      observer.observe(adRef.current);
    }
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="ad-container my-4" style={{ minHeight: '100px' }}>
      <ins ref={adRef}
           className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-app-pub-4663862602910608"
           data-ad-slot="3929315334"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}
