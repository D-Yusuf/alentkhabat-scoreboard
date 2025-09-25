import React from 'react';
import { useTranslation } from 'react-i18next';

const PromoBar = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-primary text-primary-foreground text-center p-2 rounded-md mb-4">
      <p className="text-sm font-medium">{t('promo_bar_text')}</p>
    </div>
  );
};

export default PromoBar;