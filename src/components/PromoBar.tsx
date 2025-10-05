import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [dynamicDuration, setDynamicDuration] = useState(15);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Effect for static text mode: cycle every 30s
  useEffect(() => {
    if (!isPromoBarTextMoving) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isPromoBarTextMoving, athkarList.length]);

  // Effect for moving text mode: control the animation sequence
  useEffect(() => {
    if (isPromoBarTextMoving) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isPromoBarTextMoving]);

  // Effect to calculate animation duration
  useEffect(() => {
    if (isPromoBarTextMoving && isAnimating && textRef.current) {
      const pixelsPerSecond = { slow: 50, medium: 80, fast: 120 };
      const speed = pixelsPerSecond[promoBarAnimationSpeed];
      const containerWidth = textRef.current.parentElement?.offsetWidth || 0;
      const textWidth = textRef.current.scrollWidth;
      const distance = containerWidth + textWidth;
      const duration = distance / speed;
      setDynamicDuration(duration);
    }
  }, [currentIndex, isPromoBarTextMoving, promoBarAnimationSpeed, isAnimating]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % athkarList.length);
      setIsAnimating(true);
    }, 2000); // 2-second pause
  };

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const currentText = athkarList[currentIndex];

  if (isPromoBarTextMoving) {
    const isRTL = i18n.dir() === 'rtl';
    const animationClass = isRTL ? 'animate-scroll-across-rtl' : 'animate-scroll-across';
    const animationStyle = { animationDuration: `${dynamicDuration}s` };
    return (
      <div className="bg-primary text-primary-foreground py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap h-8 relative">
        {isAnimating && (
          <p
            ref={textRef}
            key={currentIndex}
            onAnimationEnd={handleAnimationEnd}
            className={`text-base font-medium absolute ${animationClass}`}
            style={animationStyle}
          >
            {currentText}
          </p>
        )}
      </div>
    );
  }

  // Static mode
  return (
    <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4">
      <p className="text-base font-medium">
        {currentText}
      </p>
    </div>
  );
};

export default PromoBar;