import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

// --- Moving Text Component ---
const MovingAthkar = ({ athkarList, animationSpeed, isRTL }: { athkarList: string[], animationSpeed: 'slow' | 'medium' | 'fast', isRTL: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const textElement = textRef.current;
    const containerElement = containerRef.current;
    if (!textElement || !containerElement) return;

    // Ensure the new text is visible before starting animation
    textElement.style.opacity = '1';
    let isMounted = true;

    const runAnimation = () => {
      if (!isMounted) return;

      const textWidth = textElement.offsetWidth;
      const containerWidth = containerElement.offsetWidth;

      // If the element isn't rendered with a width yet, wait a moment and try again.
      if (textWidth === 0 || containerWidth === 0) {
        setTimeout(runAnimation, 50);
        return;
      }

      let speed: number;
      switch (animationSpeed) {
        case 'slow': speed = 40; break;
        case 'fast': speed = 120; break;
        default: speed = 80; break;
      }
      
      const distance = containerWidth + textWidth;
      const duration = (distance / speed) * 1000;

      const keyframes = isRTL ? [
        { transform: `translateX(-${textWidth}px)` },
        { transform: `translateX(${containerWidth}px)` }
      ] : [
        { transform: `translateX(${containerWidth}px)` },
        { transform: `translateX(-${textWidth}px)` }
      ];

      animationRef.current = textElement.animate(keyframes, {
        duration: duration,
        easing: 'linear',
      });

      animationRef.current.onfinish = () => {
        if (isMounted) {
          // Hide the element after animation finishes to prevent it from reappearing
          textElement.style.opacity = '0';
          
          setTimeout(() => {
            // This will trigger the useEffect for the next item
            setCurrentIndex(prev => (prev + 1) % athkarList.length);
          }, 5000); // 5-second pause
        }
      };
    };

    runAnimation();

    return () => {
      isMounted = false;
      animationRef.current?.cancel();
    };
  }, [currentIndex, athkarList, animationSpeed, isRTL]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <span
        ref={textRef}
        className="absolute whitespace-nowrap"
        key={currentIndex} // This forces React to create a new element when the index changes
      >
        {athkarList[currentIndex]}
      </span>
    </div>
  );
};

// --- Static Text Component ---
const StaticAthkar = ({ athkarList }: { athkarList: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPaused) {
      // This is the 4-second pause period
      timer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % athkarList.length);
        setIsPaused(false); // Start showing the next item
      }, 4000);
    } else {
      // This is the 10-second display period
      timer = setTimeout(() => {
        setIsPaused(true); // Start fading out
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [isPaused, athkarList.length]);

  return (
    <span className="text-base font-medium px-4 inline-block transition-opacity duration-500" style={{ opacity: isPaused ? 0 : 1 }}>
      {/* Use a non-breaking space during pause to maintain height */}
      {isPaused ? '\u00A0' : athkarList[currentIndex]}
    </span>
  );
};

// --- Main PromoBar Component ---
const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();

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

  const isRTL = i18n.dir() === 'rtl';
  const containerClasses = `bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4 overflow-hidden flex items-center justify-center min-h-[2.25rem] ${isPromoBarTextMoving ? 'whitespace-nowrap' : 'whitespace-normal'}`;

  return (
    <div dir={i18n.dir()} className={containerClasses}>
      {isPromoBarTextMoving ? (
        <MovingAthkar 
          athkarList={athkarList} 
          animationSpeed={promoBarAnimationSpeed}
          isRTL={isRTL}
        />
      ) : (
        <StaticAthkar athkarList={athkarList} />
      )}
    </div>
  );
};

export default PromoBar;