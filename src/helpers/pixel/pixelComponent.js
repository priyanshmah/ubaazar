'use client';

import { useEffect } from 'react';

export default function FacebookPixel() {
  useEffect(() => {
    // Dynamically import the library to ensure it's only loaded on the client
    const initPixel = async () => {
      if (typeof window !== 'undefined') {
        const ReactPixel = (await import('react-facebook-pixel')).default;
        
        const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

        if (!pixelId) {
          console.warn('Facebook Pixel ID is not set');
          return;
        }

        ReactPixel.init(pixelId, {}, { 
          autoConfig: true, 
          debug: process.env.NODE_ENV !== 'production' 
        });

        ReactPixel.pageView();
      }
    };

    initPixel();
  }, []);

  return null;
}

export const trackPixelEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined') {
    import('react-facebook-pixel').then((ReactPixel) => {
      ReactPixel.default.track(eventName, eventData);
    });
  }
};