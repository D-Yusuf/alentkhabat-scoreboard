import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [shuffledAthkar, setShuffledAthkar] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // For static mode
  const textRef = useRef<HTMLParagraphElement>(null); // For duration calculation
  const [animationDuration, setAnimationDuration] = useState('60s');

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  // Shuffle list for marquee mode
  useEffect(() => {
    if (isPromoBarTextMoving && athkarList.length > 0) {
      const shuffled = [...athkarList].sort(() => Math.random() - 0.5);
      setShuffledAthkar(shuffled);
    }
  }, [isPromoBarTextMoving, athkarList.length]);

  // Cycle text for static mode
  useEffect(() => {
    if (!isPromoBarTextMoving && athkarList.length > 0) {
      // Set initial random index for static mode
      setCurrentIndex(Math.floor(Math.random() * athkarList.length));

      const interval = setInterval(() => {
        // Select next random index without repeating
        setCurrentIndex(prevIndex => {
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * athkarList.length);
          } while (nextIndex === prevIndex && athkarList.length > 1);
          return nextIndex;
        });
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isPromoBarTextMoving, athkarList.length]);

  // Calculate animation duration for marquee
  useEffect(() => {
    if (isPromoBarTextMoving && textRef.current) {
      const pixelsPerSecond = { slow: 30, medium: 50, fast: 80 };
      const speed = pixelsPerSecond[promoBarAnimationSpeed];
      const textWidth = textRef.current.scrollWidth;
      const duration = textWidth / speed;
      setAnimationDuration(`${duration}s`);
    }
  }, [shuffledAthkar, isPromoBarTextMoving, promoBarAnimationSpeed]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  if (isPromoBarTextMoving) {
    const isRTL = i18n.dir() === 'rtl';
    const animationClass = isRTL ? 'animate-marquee-rtl' : 'animate-marquee';
    const marqueeText = shuffledAthkar.join(' • ');

    return (
      <div className="bg-primary text-primary-foreground py-1 px-2 rounded-md mb-4 overflow-hidden relative h-8 flex items-center">
        <div
          className={`flex w-[200%] ${animationClass}`}
          style={{ animationDuration }}
        >
          <p ref={textRef} className="w-1/2 flex-shrink-0 text-center whitespace-nowrap text-base font-medium">
            {marqueeText}
          </p>
          <p className="w-1/2 flex-shrink-0 text-center whitespace-nowrap text-base font-medium">
            {marqueeText}
          </p>
        </div>
      </div>
    );
  }

  // Static mode
  return (
    <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4">
      <p className="text-base font-medium">
        {athkarList[currentIndex]}
      </p>
    </div>
  );
};

export default PromoBar;