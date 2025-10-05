import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Effect to set a random index on language change or initial load
  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) {
      return;
    }
    setCurrentIndex(Math.floor(Math.random() * athkarList.length));
  }, [i18n.language, athkarList.length]);

  // Effect to manage the interval for switching remembrances
  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) {
      return;
    }

    let intervalDuration: number;

    if (isPromoBarTextMoving) {
      const durations = {
        slow: 30000,   // 30 seconds per loop
        medium: 15000, // 15 seconds per loop
        fast: 5000,    // 5 seconds per loop
      };
      // Switch after two loops
      intervalDuration = durations[promoBarAnimationSpeed] * 2;
    } else {
      // Switch every 30 seconds for static text
      intervalDuration = 30000;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % athkarList.length);
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [isPromoBarTextMoving, promoBarAnimationSpeed, athkarList.length]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const isRTL = i18n.dir() === 'rtl';

  // Mappings for LTR and RTL animations
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

  const animationClass = isPromoBarTextMoving 
    ? animationClasses[promoBarAnimationSpeed]
    : '';

  const containerWhitespaceClass = isPromoBarTextMoving ? 'whitespace-nowrap' : 'whitespace-normal';

  return (
    <div className={`bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden ${containerWhitespaceClass}`}>
      <p className={`text-base font-medium inline-block ${animationClass}`}>
        {athkarList[currentIndex]}
      </p>
    </div>
  );
};

export default PromoBar;