import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

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

  const isRTL = i18n.dir() === 'rtl';

  useLayoutEffect(() => {
    const element = marqueeRef.current;
    if (!isPromoBarTextMoving || !element) {
      animationRef.current?.cancel();
      return;
    }

    element.style.transform = 'translateX(0)';
    let isMounted = true;

    const runAnimation = () => {
      if (!isMounted || !element) return;

      const contentWidth = element.scrollWidth / 2;
      if (contentWidth === 0) {
        setTimeout(runAnimation, 100);
        return;
      }
      
      let speed: number;
      switch (promoBarAnimationSpeed) {
        case 'slow': speed = 40; break;
        case 'fast': speed = 120; break;
        default: speed = 80; break;
      }
      const moveDuration = (contentWidth / speed) * 1000;
      const pauseDuration = 5000;

      const keyframes = isRTL ? [
          { transform: 'translateX(0)' },
          { transform: 'translateX(50%)' }
      ] : [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-50%)' }
      ];

      const animation = element.animate(keyframes, {
        duration: moveDuration,
        easing: 'linear',
      });
      animationRef.current = animation;

      animation.onfinish = () => {
        setTimeout(() => {
            if (isMounted) {
                element.style.transform = 'translateX(0)';
                runAnimation();
            }
        }, pauseDuration);
      };
    };

    runAnimation();

    return () => {
      isMounted = false;
      animationRef.current?.cancel();
    };
  }, [isPromoBarTextMoving, promoBarAnimationSpeed, athkarList, isRTL]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  return (
    <div dir={i18n.dir()} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      {isPromoBarTextMoving ? (
        <div
          ref={marqueeRef}
          className="inline-flex"
        >
          {athkarList.map((athkar, index) => (
            <span key={`first-${index}`} className="text-base font-medium px-10">{athkar}</span>
          ))}
          {athkarList.map((athkar, index) => (
            <span key={`second-${index}`} className="text-base font-medium px-10" aria-hidden="true">{athkar}</span>
          ))}
        </div>
      ) : (
        <StaticAthkar athkarList={athkarList} />
      )}
    </div>
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

export default PromoBar;