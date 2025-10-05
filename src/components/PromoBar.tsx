import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScore } from '@/context/ScoreContext';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const { isPromoBarTextMoving, promoBarAnimationSpeed } = useScore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHiding, setIsHiding] = useState(false); // For smooth transition
  const textRef = useRef<HTMLParagraphElement>(null);
  const [dynamicDuration, setDynamicDuration] = useState(15);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  const selectNextRandomIndex = () => {
    if (athkarList.length <= 1) {
      return;
    }
    setCurrentIndex(prevIndex => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * athkarList.length);
      } while (nextIndex === prevIndex);
      return nextIndex;
    });
  };

  // Effect for static text mode: cycle randomly every 30s
  useEffect(() => {
    if (!isPromoBarTextMoving) {
      const interval = setInterval(() => {
        selectNextRandomIndex();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isPromoBarTextMoving, athkarList.length]);

  // Effect to calculate animation duration
  useEffect(() => {
    if (isPromoBarTextMoving && !isHiding && textRef.current) {
      const pixelsPerSecond = { slow: 50, medium: 80, fast: 120 };
      const speed = pixelsPerSecond[promoBarAnimationSpeed];
      const containerWidth = textRef.current.parentElement?.offsetWidth || 0;
      const textWidth = textRef.current.scrollWidth;
      const distance = containerWidth + textWidth;
      const duration = distance / speed;
      setDynamicDuration(duration);
    }
  }, [currentIndex, isPromoBarTextMoving, promoBarAnimationSpeed, isHiding]);

  const handleAnimationEnd = () => {
    setIsHiding(true); // Hide the element smoothly
    setTimeout(() => {
      selectNextRandomIndex(); // Select new text
      setIsHiding(false); // Show the new element to start animation
    }, 2000); // 2-second pause
  };

  // Set initial random index
  useEffect(() => {
    if (athkarList.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * athkarList.length));
    }
  }, [athkarList.length]);


  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  const currentText = athkarList[currentIndex];

  if (isPromoBarTextMoving) {
    const isRTL = i18n.dir() === 'rtl';
    const animationClass = isRTL ? 'animate-scroll-across-rtl' : 'animate-scroll-across';
    const animationStyle = { animationDuration: `${dynamicDuration}s` };
    
    return (
      <div className="bg-primary text-primary-foreground py-1 px-2 rounded-md mb-4 overflow-hidden whitespace-nowrap h-8 relative">
        <p
          ref={textRef}
          key={currentIndex} // Key change will reset the animation
          onAnimationEnd={handleAnimationEnd}
          className={`text-base font-medium absolute transition-opacity duration-300 ${animationClass} ${isHiding ? 'opacity-0' : 'opacity-100'}`}
          style={animationStyle}
        >
          {currentText}
        </p>
      </div>
    );
  }

  // Static mode
  return (
    <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4">
      <p className="text-base font-medium">
        {currentText}
      </p>
    </div>
  );
};

export default PromoBar;