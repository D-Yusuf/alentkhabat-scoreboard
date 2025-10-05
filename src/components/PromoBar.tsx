import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

// Component for the new slide-and-pause animation
const SlidingAthkar = ({ athkarList, animationSpeed }: { athkarList: string[], animationSpeed: 'slow' | 'medium' | 'fast' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const { duration, interval } = useMemo(() => {
    switch (animationSpeed) {
      case 'slow': return { duration: '8s', interval: 11000 }; // 8s animation + 3s gap
      case 'fast': return { duration: '3s', interval: 5000 }; // 3s animation + 2s gap
      default: return { duration: '5s', interval: 7000 }; // 5s animation + 2s gap
    }
  }, [animationSpeed]);

  useEffect(() => {
    if (athkarList.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [athkarList.length, interval]);

  const animationClass = isRTL ? 'animate-slide-in-out-rtl' : 'animate-slide-in-out';

  return (
    <div className="relative h-6 flex justify-center items-center">
      <span
        key={currentIndex} // This is crucial to restart the animation for each item
        className={`absolute whitespace-nowrap ${animationClass}`}
        style={{ animationDuration: duration, animationTimingFunction: 'ease-in-out' }}
      >
        {athkarList[currentIndex]}
      </span>
    </div>
  );
};

// Component for the static, fading text
const StaticAthkar = ({ athkarList }: { athkarList: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % athkarList.length);
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(intervalId);
  }, [athkarList.length]);

  return <span className="text-base font-medium px-4">{athkarList[currentIndex]}</span>;
};

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();

  const athkarList = useMemo(() => t('athkar_list', { returnObjects: true }) as string[], [i18n.language]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  return (
    <div dir={i18n.dir()} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden">
      {isPromoBarTextMoving ? (
        <SlidingAthkar athkarList={athkarList} animationSpeed={promoBarAnimationSpeed} />
      ) : (
        <StaticAthkar athkarList={athkarList} />
      )}
    </div>
  );
};

export default PromoBar;