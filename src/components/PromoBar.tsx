import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PromoBar = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const athkarList = t('athkar_list', { returnObjects: true }) as string[];

  useEffect(() => {
    if (!Array.isArray(athkarList) || athkarList.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % athkarList.length);
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [athkarList, i18n.language]);

  if (!Array.isArray(athkarList) || athkarList.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mb-4">
      <p className="text-sm font-medium">{athkarList[currentIndex]}</p>
    </div>
  );
};

export default PromoBar;