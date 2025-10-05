import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});
  const [key, setKey] = useState(0); // Key to restart animation

  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Effect for static mode: cycle text every 60s
  useEffect(() => {
    if (!isPromoBarTextMoving && athkarList.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isPromoBarTextMoving, athkarList.length]);

  // Effect to calculate animation duration when text or mode changes
  useEffect(() => {
    if (isPromoBarTextMoving && textRef.current && containerRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;
      
      const distance = containerWidth + textWidth;
      
      let speed: number;
      switch (promoBarAnimationSpeed) {
        case 'slow': speed = 40; break;
        case 'fast': speed = 120; break;
        default: speed = 80; break;
      }
      const duration = distance / speed;
      setAnimationStyle({ animationDuration: `${duration}s` });
    } else {
      setAnimationStyle({});
    }
  }, [currentIndex, isPromoBarTextMoving, promoBarAnimationSpeed, athkarList, i18n.language]);

  // Reset animation when switching to "moving" mode
  useEffect(() => {
    if (isPromoBarTextMoving) {
      setKey(prev => prev + 1);
    }
  }, [isPromoBarTextMoving]);

  const handleAnimationEnd = () => {
    // Wait for a short delay, then show the next text
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % athkarList.length);
      setKey(prev => prev + 1); // This triggers re-render and re-animation
    }, 2000); // 2-second delay
  };

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const isRTL = i18n.dir() === 'rtl';
  const currentAthkar = athkarList[currentIndex];
  const animationClass = isRTL ? 'animate-marquee-single-rtl' : 'animate-marquee-single';

  return (
    <div ref={containerRef} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      {isPromoBarTextMoving ? (
        <div
          key={key}
          onAnimationEnd={handleAnimationEnd}
          className={`inline-block ${animationClass}`}
          style={animationStyle}
        >
          <span ref={textRef} className="text-base font-medium px-4">{currentAthkar}</span>
        </div>
      ) : (
        <span className="text-base font-medium px-4">{currentAthkar}</span>
      )}
    </div>
  );
};

export default PromoBar;