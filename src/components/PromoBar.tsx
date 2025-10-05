import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const MovingAthkar = ({ athkarList }: { athkarList: string[] }) => {
  const { promoBarAnimationSpeed } = useScore();
  const { i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});
  const textRef = useRef<HTMLSpanElement>(null);
  const isRTL = i18n.dir() === 'rtl';

  useLayoutEffect(() => {
    const textElement = textRef.current;
    const containerElement = textElement?.parentElement;

    if (!textElement || !containerElement) return;

    const textWidth = textElement.offsetWidth;
    const containerWidth = containerElement.offsetWidth;

    let speed: number; // pixels per second
    switch (promoBarAnimationSpeed) {
      case 'slow': speed = 40; break;
      case 'fast': speed = 120; break;
      default: speed = 80; break;
    }

    const distance = containerWidth + textWidth;
    const duration = distance / speed; // in seconds

    if (duration > 0) {
      const animationName = isRTL ? 'slide-across-rtl' : 'slide-across';
      setAnimationStyle({
        animationName,
        animationDuration: `${duration}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 1,
      });
    }

    const pauseDuration = 5000; // 5 seconds
    const totalCycleTime = (duration * 1000) + pauseDuration;

    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % athkarList.length);
    }, totalCycleTime);

    return () => clearTimeout(timer);
  }, [currentIndex, athkarList, promoBarAnimationSpeed, isRTL]);

  return (
    <span
      key={currentIndex} // Remounts component to restart animation
      ref={textRef}
      className="inline-block px-4"
      style={animationStyle}
    >
      {athkarList[currentIndex]}
    </span>
  );
};

const StaticAthkar = ({ athkarList }: { athkarList: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPaused) {
      timer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
        setIsPaused(false);
      }, 5000);
    } else {
      timer = setTimeout(() => {
        setIsPaused(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [isPaused, athkarList.length]);

  return (
    <span className="text-base font-medium px-4 inline-block transition-opacity duration-500" style={{ opacity: isPaused ? 0 : 1 }}>
      {isPaused ? '\u00A0' : athkarList[currentIndex]}
    </span>
  );
};

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving } = useScore();

  const athkarList = useMemo(() => {
    const originalList = t('athkar_list', { returnObjects: true }) as string[];
    if (!Array.isArray(originalList)) return [];
    
    const shuffledList = [...originalList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    return shuffledList;
  }, [i18n.language, t]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  return (
    <div dir={i18n.dir()} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      {isPromoBarTextMoving ? (
        <MovingAthkar athkarList={athkarList} />
      ) : (
        <StaticAthkar athkarList={athkarList} />
      )}
    </div>
  );
};

export default PromoBar;