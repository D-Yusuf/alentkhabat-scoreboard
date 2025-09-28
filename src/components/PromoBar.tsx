import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) {
      return;
    }

    // Set a random index when the language is loaded/changed
    setCurrentIndex(Math.floor(Math.random() * athkarList.length));

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % athkarList.length);
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [i18n.language]); // Re-run effect only when language changes

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  // This mapping ensures Tailwind's JIT compiler detects the full class names
  const animationSpeedClasses = {
    slow: 'animate-marquee-slow',
    medium: 'animate-marquee-medium',
    fast: 'animate-marquee-fast',
  };

  const animationClass = isPromoBarTextMoving 
    ? animationSpeedClasses[promoBarAnimationSpeed]
    : '';

  return (
    <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      <p className={`text-base font-medium inline-block ${animationClass}`}>
        {athkarList[currentIndex]}
      </p>
    </div>
  );
};

export default PromoBar;