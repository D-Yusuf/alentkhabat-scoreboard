import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [dynamicDuration, setDynamicDuration] = useState<number | null>(null);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Effect to set a random index on language change or initial load
  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) {
      return;
    }
    setCurrentIndex(Math.floor(Math.random() * athkarList.length));
  }, [i18n.language, athkarList.length]);

  // Effect to calculate dynamic animation duration
  useEffect(() => {
    if (isPromoBarTextMoving && textRef.current) {
      const pixelsPerSecond = {
        slow: 30,
        medium: 60,
        fast: 120,
      };
      const speed = pixelsPerSecond[promoBarAnimationSpeed];
      // We animate over half the width because the content is duplicated
      const width = textRef.current.scrollWidth / 2;
      const duration = width / speed;
      setDynamicDuration(duration);
    } else {
      setDynamicDuration(null);
    }
  }, [currentIndex, isPromoBarTextMoving, promoBarAnimationSpeed, athkarList]);

  // Effect to manage the interval for switching remembrances
  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) {
      return;
    }

    let intervalDuration: number;

    if (isPromoBarTextMoving) {
      const duration = dynamicDuration ?? 15; // Fallback to 15s if not calculated yet
      intervalDuration = duration * 1000 * 2; // Switch after two loops
    } else {
      intervalDuration = 30000; // Switch every 30 seconds for static text
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % athkarList.length);
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [isPromoBarTextMoving, dynamicDuration, athkarList.length]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const isRTL = i18n.dir() === 'rtl';

  const ltrAnimationSpeedClasses = {
    slow: 'animate-marquee-slow',
    medium: 'animate-marquee-medium',
    fast: 'animate-marquee-fast',
  };

  const rtlAnimationSpeedClasses = {
    slow: 'animate-marquee-rtl-slow',
    medium: 'animate-marquee-rtl-medium',
    fast: 'animate-marquee-rtl-fast',
  };

  const animationClasses = isRTL ? rtlAnimationSpeedClasses : ltrAnimationSpeedClasses;
  const animationClass = isPromoBarTextMoving ? animationClasses[promoBarAnimationSpeed] : '';

  const containerWhitespaceClass = isPromoBarTextMoving ? 'whitespace-nowrap' : 'whitespace-normal';

  const animationStyle = dynamicDuration ? { animationDuration: `${dynamicDuration}s` } : {};

  const currentText = athkarList[currentIndex];

  return (
    <div className={`bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden ${containerWhitespaceClass}`}>
      <p
        ref={textRef}
        className={`text-base font-medium ${isPromoBarTextMoving ? 'inline-flex' : 'inline-block'} ${animationClass}`}
        style={animationStyle}
      >
        {currentText}
        {isPromoBarTextMoving && (
          <>
            <span className="px-4" />
            {currentText}
          </>
        )}
      </p>
    </div>
  );
};

export default PromoBar;