import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [dynamicDuration, setDynamicDuration] = useState(15);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Effect for static text mode
  useEffect(() => {
    if (!isPromoBarTextMoving) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isPromoBarTextMoving, athkarList.length]);

  // Effect to handle the pause between animations
  useEffect(() => {
    if (isPromoBarTextMoving && isPaused) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
        setIsPaused(false);
      }, 2000); // 2-second pause
      return () => clearTimeout(timer);
    }
  }, [isPromoBarTextMoving, isPaused, athkarList.length]);

  // Effect to calculate animation duration based on text and container width
  useEffect(() => {
    if (isPromoBarTextMoving && textRef.current && !isPaused) {
      const pixelsPerSecond = { slow: 50, medium: 80, fast: 120 };
      const speed = pixelsPerSecond[promoBarAnimationSpeed];
      const containerWidth = textRef.current.parentElement?.offsetWidth || 0;
      const textWidth = textRef.current.scrollWidth;
      const distance = containerWidth + textWidth;
      const duration = distance / speed;
      setDynamicDuration(duration);
    }
  }, [currentIndex, isPromoBarTextMoving, promoBarAnimationSpeed, isPaused]);

  const handleAnimationEnd = () => {
    if (isPromoBarTextMoving) {
      setIsPaused(true);
    }
  };

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const isRTL = i18n.dir() === 'rtl';
  const currentText = athkarList[currentIndex];
  const animationName = isRTL ? 'scroll-across-rtl' : 'scroll-across';
  const animationStyle = {
    animationName,
    animationDuration: `${dynamicDuration}s`,
    animationTimingFunction: 'linear',
  };

  return (
    <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden relative h-8 flex items-center justify-center">
      {isPromoBarTextMoving ? (
        !isPaused && (
          <p
            ref={textRef}
            key={currentIndex}
            onAnimationEnd={handleAnimationEnd}
            className="text-base font-medium whitespace-nowrap absolute"
            style={animationStyle}
          >
            {currentText}
          </p>
        )
      ) : (
        <p className="text-base font-medium">
          {currentText}
        </p>
      )}
    </div>
  );
};

export default PromoBar;