import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

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
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.dir() === 'rtl';

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

  useEffect(() => {
    if (!isPromoBarTextMoving) return;

    const textElement = textRef.current;
    const containerElement = containerRef.current;

    if (!textElement || !containerElement) return;

    let isMounted = true;
    let animation: Animation | null = null;

    const runAnimation = () => {
      if (!isMounted) return;

      const textWidth = textElement.offsetWidth;
      const containerWidth = containerElement.offsetWidth;

      if (textWidth === 0 || containerWidth === 0) {
        setTimeout(runAnimation, 50);
        return;
      }

      let speed: number;
      switch (promoBarAnimationSpeed) {
        case 'slow': speed = 40; break;
        case 'fast': speed = 120; break;
        default: speed = 80; break;
      }
      const distance = containerWidth + textWidth;
      const duration = (distance / speed) * 1000;

      const keyframes = isRTL
        ? [
            { transform: `translateX(-${containerWidth}px)` },
            { transform: `translateX(${textWidth}px)` },
          ]
        : [
            { transform: `translateX(${containerWidth}px)` },
            { transform: `translateX(-${textWidth}px)` },
          ];

      animation = textElement.animate(keyframes, { duration, easing: 'linear' });

      animation.onfinish = () => {
        if (!isMounted) return;
        setTimeout(() => {
          if (isMounted) {
            setCurrentIndex(prev => (prev + 1) % athkarList.length);
          }
        }, 5000);
      };
    };

    runAnimation();

    return () => {
      isMounted = false;
      animation?.cancel();
    };
  }, [currentIndex, isPromoBarTextMoving, athkarList, promoBarAnimationSpeed, isRTL]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} dir={i18n.dir()} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      {isPromoBarTextMoving ? (
        <span ref={textRef} className="inline-block px-4">
          {athkarList[currentIndex]}
        </span>
      ) : (
        <StaticAthkar athkarList={athkarList} />
      )}
    </div>
  );
};

export default PromoBar;