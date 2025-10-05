import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Memoize athkarList to prevent re-creating the array on every render, which causes an infinite loop.
  const athkarList = useMemo(() => t('athkar_list', { returnObjects: true }) as string[], [i18n.language]);

  useLayoutEffect(() => {
    if (isPromoBarTextMoving && marqueeRef.current) {
      const contentWidth = marqueeRef.current.scrollWidth / 2;
      
      let speed: number; // pixels per second
      switch (promoBarAnimationSpeed) {
        case 'slow': speed = 40; break;
        case 'fast': speed = 120; break;
        default: speed = 80; break;
      }
      const duration = contentWidth / speed;

      if (duration > 0) {
        setAnimationStyle({ animationDuration: `${duration}s` });
      } else {
        setAnimationStyle({});
      }
    } else {
      setAnimationStyle({});
    }
  }, [isPromoBarTextMoving, promoBarAnimationSpeed, athkarList]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const isRTL = i18n.dir() === 'rtl';
  const animationClass = isPromoBarTextMoving 
    ? (isRTL ? 'animate-marquee-rtl' : 'animate-marquee')
    : '';

  return (
    <div dir={i18n.dir()} className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap">
      {isPromoBarTextMoving ? (
        <div
          ref={marqueeRef}
          className={`inline-flex ${animationClass}`}
          style={animationStyle}
        >
          {/* Render the full list of remembrances twice for a seamless loop */}
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

// A small helper component to manage the state for the static text display
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

export default PromoBar;