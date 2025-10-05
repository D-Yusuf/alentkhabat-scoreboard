import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});
  const [showAnimation, setShowAnimation] = useState(false);
  
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Effect to cycle through remembrances every minute
  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % athkarList.length);
    }, 60000); // Change text every 60 seconds

    return () => clearInterval(intervalId);
  }, [athkarList.length]);

  // Effect to calculate animation duration based on text length
  useEffect(() => {
    if (isPromoBarTextMoving && textRef.current && containerRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;

      if (textWidth > containerWidth) {
        setShowAnimation(true);
        let speed: number; // pixels per second
        switch (promoBarAnimationSpeed) {
          case 'slow':
            speed = 40;
            break;
          case 'fast':
            speed = 120;
            break;
          case 'medium':
          default:
            speed = 80;
            break;
        }
        const duration = textWidth / speed;
        setAnimationStyle({ animationDuration: `${duration}s` });
      } else {
        // Text fits, no animation needed
        setShowAnimation(false);
        setAnimationStyle({});
      }
    } else {
      setShowAnimation(false);
      setAnimationStyle({});
    }
  }, [currentIndex, isPromoBarTextMoving, promoBarAnimationSpeed, athkarList, i18n.language]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const isRTL = i18n.dir() === 'rtl';
  const currentAthkar = athkarList[currentIndex];

  const animationClass = showAnimation 
    ? (isRTL ? 'animate-marquee-rtl' : 'animate-marquee')
    : '';

  return (
    <div ref={containerRef} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      <div 
        className={`inline-flex ${animationClass}`} 
        style={animationStyle}
      >
        <span ref={textRef} className="text-base font-medium px-4">{currentAthkar}</span>
        {showAnimation && (
          <span className="text-base font-medium px-4" aria-hidden="true">{currentAthkar}</span>
        )}
      </div>
    </div>
  );
};

export default PromoBar;